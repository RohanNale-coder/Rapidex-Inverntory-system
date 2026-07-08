import express from 'express';

const router = express.Router();

router.get('/guide', async (req, res) => {
  try {
    res.json({ message: 'User guide endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/faqs', async (req, res) => {
  try {
    res.json({ message: 'FAQs endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/feedback', async (req, res) => {
  try {
    res.json({ message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;