import express from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getFavorites)
  .post(protect, addFavorite);

router.route('/:id')
  .delete(protect, removeFavorite);

router.get('/check/:itemType/:itemId', protect, checkFavorite);

export default router;
