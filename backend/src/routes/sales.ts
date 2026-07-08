import express from 'express';
import SalesOrder from '../models/SalesOrder';
import SalesInvoice from '../models/SalesInvoice';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/orders', authenticate, async (req, res) => {
  try {
    const orders = await SalesOrder.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/orders', authenticate, async (req, res) => {
  try {
    const order = await SalesOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/invoices', authenticate, async (req, res) => {
  try {
    const invoices = await SalesInvoice.findAll();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/invoices', authenticate, async (req, res) => {
  try {
    const invoice = await SalesInvoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;