import express from 'express';
import Notification from '../models/Notification';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.update({ isRead: true, readAt: new Date() });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;