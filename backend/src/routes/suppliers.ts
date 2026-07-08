import express from 'express';
import Supplier from '../models/Supplier';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    await supplier.update(req.body);
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    await supplier.destroy();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;