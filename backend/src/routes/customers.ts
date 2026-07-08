import express from 'express';
import Customer from '../models/Customer';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await customer.update(req.body);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await customer.destroy();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;