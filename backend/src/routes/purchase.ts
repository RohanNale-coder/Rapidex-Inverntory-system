import express from 'express';
import PurchaseOrder from '../models/PurchaseOrder';
import PurchaseInvoice from '../models/PurchaseInvoice';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/orders', authenticate, async (req, res) => {
  try {
    const orders = await PurchaseOrder.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/orders', authenticate, async (req, res) => {
  try {
    const order = await PurchaseOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/invoices', authenticate, async (req, res) => {
  try {
    const invoices = await PurchaseInvoice.findAll();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/invoices', authenticate, async (req, res) => {
  try {
    const invoice = await PurchaseInvoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;