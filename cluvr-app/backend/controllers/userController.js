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
      .select('-password')
      .populate('savedClubs', 'name emoji image category members gradient')
      .populate({
        path: 'joinedEvents',
        select: 'title date location clubId image emoji gradient category',
        populate: { path: 'clubId', select: 'name emoji image' },
      })
      .populate('following', 'name emoji image gradient members');
    
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

    console.log('Saving quiz results for user:', req.user.id);
    console.log('Interests:', interests);
    console.log('Recommendations:', recommendations);

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

    console.log('User updated with quiz results:', user.quizResults);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error saving quiz results:', error);
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

    console.log('Saving club for user:', req.user.id);
    console.log('Club ID:', clubId);

    const isSaved = user.savedClubs.some(id => id.toString() === clubId);

    if (isSaved) {
      user.savedClubs.pull(clubId);
      console.log('Removed club from saved');
    } else {
      user.savedClubs.push(clubId);
      console.log('Added club to saved');
    }

    await user.save();

    console.log('Saved clubs after update:', user.savedClubs);

    res.status(200).json({
      success: true,
      saved: !isSaved,
      data: user.savedClubs
    });
  } catch (error) {
    console.error('Error saving club:', error);
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

    console.log('Joining event for user:', req.user.id);
    console.log('Event ID:', eventId);

    const isJoined = user.joinedEvents.some(id => id.toString() === eventId);

    if (isJoined) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    user.joinedEvents.push(eventId);
    await user.save();

    res.status(200).json({
      success: true,
      joined: true,
      data: user.joinedEvents
    });
  } catch (error) {
    console.error('Error joining event:', error);
    next(error);
  }
};

// @desc    Follow/Unfollow club
// @route   POST /api/users/follow-club/:clubId
// @access  Private
export const followClub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const clubId = req.params.clubId;

    console.log('Following club for user:', req.user.id);
    console.log('Club ID:', clubId);

    const isFollowing = user.following.some(id => id.toString() === clubId);

    if (isFollowing) {
      user.following.pull(clubId);
    } else {
      user.following.push(clubId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      following: !isFollowing,
      data: user.following
    });
  } catch (error) {
    console.error('Error following club:', error);
    next(error);
  }
};
