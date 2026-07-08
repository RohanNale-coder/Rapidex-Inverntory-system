import express from 'express';
import { Op } from 'sequelize';
import db from '../models';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const SalesInvoice = db.SalesInvoice;
    const PurchaseInvoice = db.PurchaseInvoice;
    const Product = db.Product;
    const Customer = db.Customer;
    const Supplier = db.Supplier;
    const Inventory = db.Inventory;

    // Total Sales Revenue (sum of all non-cancelled sales invoices)
    const salesRevenueResult = await SalesInvoice.findAll({
      attributes: [
        [db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('totalAmount')), 0), 'totalRevenue']
      ],
      where: {
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      raw: true
    });
    const totalRevenue = parseFloat(salesRevenueResult[0]?.totalRevenue || '0');

    // Total Sales Count
    const totalSalesCount = await SalesInvoice.count({
      where: {
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    // Total Purchase Cost (sum of all non-cancelled purchase invoices)
    const purchaseCostResult = await PurchaseInvoice.findAll({
      attributes: [
        [db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('totalAmount')), 0), 'totalCost']
      ],
      where: {
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      raw: true
    });
    const totalCost = parseFloat(purchaseCostResult[0]?.totalCost || '0');

    // Total Profit = Revenue - Cost
    const totalProfit = totalRevenue - totalCost;

    // Other counts
    const totalProducts = await Product.count({ where: { isActive: true } });
    const totalCustomers = await Customer.count({ where: { isActive: true } });
    const totalSuppliers = await Supplier.count({ where: { isActive: true } });

    // Low stock items
    const lowStockItems = await Product.count({
      where: {
        isActive: true,
        [Op.and]: db.sequelize.where(
          db.sequelize.col('reorderLevel'),
          Op.gt,
          db.sequelize.col('minStockLevel')
        )
      }
    });

    res.json({
      stats: {
        totalSales: totalSalesCount,
        totalRevenue,
        totalProfit,
        totalCost,
        totalPurchases: await PurchaseInvoice.count({
          where: {
            status: {
              [Op.notIn]: ['cancelled']
            }
          }
        }),
        totalProducts,
        totalCustomers,
        totalSuppliers,
        lowStockItems
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/sales-graph', async (req, res) => {
  try {
    const SalesInvoice = db.SalesInvoice;

    // Get monthly sales data for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const salesData = await SalesInvoice.findAll({
      attributes: [
        [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('invoiceDate')), 'month'],
        [db.sequelize.fn('SUM', db.sequelize.col('totalAmount')), 'total']
      ],
      where: {
        invoiceDate: {
          [Op.gte]: twelveMonthsAgo
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      group: [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('invoiceDate'))],
      order: [[db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('invoiceDate')), 'ASC']],
      raw: true
    });

    res.json({ salesData });
  } catch (error) {
    console.error('Sales graph error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/purchase-graph', async (req, res) => {
  try {
    const PurchaseInvoice = db.PurchaseInvoice;

    // Get monthly purchase data for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const purchaseData = await PurchaseInvoice.findAll({
      attributes: [
        [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('invoiceDate')), 'month'],
        [db.sequelize.fn('SUM', db.sequelize.col('totalAmount')), 'total']
      ],
      where: {
        invoiceDate: {
          [Op.gte]: twelveMonthsAgo
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      group: [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('invoiceDate'))],
      order: [[db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('invoiceDate')), 'ASC']],
      raw: true
    });

    res.json({ purchaseData });
  } catch (error) {
    console.error('Purchase graph error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/low-stock', async (req, res) => {
  try {
    const Product = db.Product;
    const Inventory = db.Inventory;

    const lowStockProducts = await Product.findAll({
      where: {
        isActive: true,
        [Op.and]: db.sequelize.where(
          db.sequelize.col('reorderLevel'),
          Op.gt,
          db.sequelize.col('minStockLevel')
        )
      },
      include: [{
        model: Inventory,
        required: false
      }],
      limit: 20,
      order: [['reorderLevel', 'DESC']]
    });

    res.json({ lowStock: lowStockProducts });
  } catch (error) {
    console.error('Low stock error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;