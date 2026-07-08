import express from 'express';
import Warehouse from '../models/Warehouse';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    await warehouse.update(req.body);
    res.json(warehouse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    await warehouse.destroy();
    res.json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;