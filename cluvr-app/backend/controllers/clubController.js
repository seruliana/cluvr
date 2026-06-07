import Club from '../model/club.js';

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
export const getClubs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const clubs = await Club.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Public
export const getClubById = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id).populate('followers', 'name email');
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: club
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new club
// @route   POST /api/clubs
// @access  Private (Admin)
export const createClub = async (req, res, next) => {
  try {
    const club = await Club.create(req.body);
    
    res.status(201).json({
      success: true,
      data: club
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Private (Admin)
export const updateClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: club
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Private (Admin)
export const deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow/Unfollow club
// @route   POST /api/clubs/:id/follow
// @access  Private
export const followClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    const isFollowing = club.followers.includes(req.user.id);
    
    if (isFollowing) {
      club.followers.pull(req.user.id);
    } else {
      club.followers.push(req.user.id);
    }
    
    await club.save();
    
    res.status(200).json({
      success: true,
      data: club,
      following: !isFollowing
    });
  } catch (error) {
    next(error);
  }
};
