import express from 'express';
import Company from '../models/Company';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    await company.update(req.body);
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    await company.destroy();
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;