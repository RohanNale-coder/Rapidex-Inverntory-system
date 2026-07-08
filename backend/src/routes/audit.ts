import express from 'express';
import AuditLog from '../models/AuditLog';

const router = express.Router();

router.get('/logs', async (req, res) => {
  try {
    const logs = await AuditLog.findAll();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/logs/:userId', async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      where: { userId: req.params.userId }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;