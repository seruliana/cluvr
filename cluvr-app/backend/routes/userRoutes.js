import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  saveQuizResults,
  getQuizResults,
  deleteAccount,
  saveClub,
  joinEvent
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.post('/quiz-results', protect, saveQuizResults);
router.get('/quiz-results', protect, getQuizResults);
router.delete('/account', protect, deleteAccount);

router.post('/save-club/:clubId', protect, saveClub);
router.post('/join-event/:eventId', protect, joinEvent);

export default router;
