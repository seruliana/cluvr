import Favorite from '../model/favorite.js';

// @desc    Get all user favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res, next) => {
  try {
    const { type } = req.query;
    
    let query = { user: req.user.id };
    
    if (type) {
      query.itemType = type;
    }
    
    const favorites = await Favorite.find(query)
      .populate('itemId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.body;
    
    const favorite = await Favorite.create({
      user: req.user.id,
      itemType,
      itemId
    });
    
    res.status(201).json({
      success: true,
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
export const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
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

// @desc    Check if item is favorited
// @route   GET /api/favorites/check/:itemType/:itemId
// @access  Private
export const checkFavorite = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.params;
    
    const favorite = await Favorite.findOne({
      user: req.user.id,
      itemType,
      itemId
    });
    
    res.status(200).json({
      success: true,
      isFavorited: !!favorite,
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};
