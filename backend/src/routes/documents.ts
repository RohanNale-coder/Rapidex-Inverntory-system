import express from 'express';
import Document from '../models/Document';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const document = await Document.create(req.body);
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    await document.destroy();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;