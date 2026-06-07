import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, university, major, interests } = req.body;
    
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      university,
      major,
      interests
    });
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
        interests: user.interests
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
        interests: user.interests
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedClubs', 'name emoji category members')
      .populate('joinedEvents', 'title date location clubId')
      .populate('following', 'name email');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, university, major, bio, interests } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        name, 
        university, 
        major, 
        bio, 
        interests,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save quiz results
// @route   POST /api/users/quiz-results
// @access  Private
export const saveQuizResults = async (req, res, next) => {
  try {
    const { interests, recommendations } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        quizResults: {
          interests,
          completedAt: new Date(),
          recommendations: recommendations || { clubs: [], events: [] }
        },
        interests,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz results
// @route   GET /api/users/quiz-results
// @access  Private
export const getQuizResults = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('quizResults interests');

    res.status(200).json({
      success: true,
      data: user.quizResults
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Unsave club
// @route   POST /api/users/save-club/:clubId
// @access  Private
export const saveClub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const clubId = req.params.clubId;
    
    const isSaved = user.savedClubs.includes(clubId);
    
    if (isSaved) {
      user.savedClubs.pull(clubId);
    } else {
      user.savedClubs.push(clubId);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      saved: !isSaved,
      data: user.savedClubs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join/Leave event
// @route   POST /api/users/join-event/:eventId
// @access  Private
export const joinEvent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const eventId = req.params.eventId;
    
    const isJoined = user.joinedEvents.includes(eventId);
    
    if (isJoined) {
      user.joinedEvents.pull(eventId);
    } else {
      user.joinedEvents.push(eventId);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      joined: !isJoined,
      data: user.joinedEvents
    });
  } catch (error) {
    next(error);
  }
};
