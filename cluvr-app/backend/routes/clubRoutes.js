import express from 'express';
import {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  followClub
} from '../controllers/clubController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getClubs)
  .post(protect, createClub);

router.route('/:id')
  .get(getClubById)
  .put(protect, updateClub)
  .delete(protect, deleteClub);

router.route('/:id/follow')
  .post(protect, followClub);

export default router;
