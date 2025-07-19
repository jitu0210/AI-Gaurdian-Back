import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.js';
import {
  getOrCreateChannel,
  updateChannel,
  uploadChannelImage,
  toggleSubscription,
  getChannel
} from '../controllers/channel.controller.js';

const router = express.Router();

router.get('/', protect, getOrCreateChannel);
router.patch('/', protect, updateChannel);
router.post('/upload/:type', protect, upload.single('image'), uploadChannelImage);
router.post('/:id/subscribe', protect, toggleSubscription);
router.get('/:id', getChannel);

export default router;