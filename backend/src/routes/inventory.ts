import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import Inventory from '../models/Inventory';
import StockTransaction from '../models/StockTransaction';
import Product from '../models/Product';
import Category from '../models/Category';
import Warehouse from '../models/Warehouse';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Multer config for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel (.xlsx, .xls) and CSV files are allowed'));
    }
  }
});

router.get('/stock', authenticate, async (req, res) => {
  try {
    const stock = await Inventory.findAll({
      include: [
        {
          model: Product,
          include: [Category]
        },
        {
          model: Warehouse,
          attributes: ['id', 'name', 'code']
        }
      ],
      order: [
        [Product, Category, 'name', 'ASC'],
        [Product, 'name', 'ASC']
      ]
    });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create stock item directly (with product lookup/creation)
router.post('/stock', authenticate, async (req, res) => {
  try {
    const { productName, productSku, categoryName, warehouseId, quantity } = req.body;

    if (!productName) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    // Find or create category
    let categoryId = null;
    if (categoryName) {
      const [category] = await Category.findOrCreate({
        where: { name: categoryName },
        defaults: { name: categoryName }
      });
      categoryId = category.id;
    }

    // Find or create product
    let product = null;
    if (productSku) {
      product = await Product.findOne({ where: { sku: productSku } });
    }
    if (!product) {
      product = await Product.findOne({ where: { name: productName } });
    }
    if (!product) {
      if (!categoryId) {
        return res.status(400).json({ message: 'Category is required to create a new product' });
      }
      product = await Product.create({
        name: productName,
        sku: productSku || null,
        categoryId,
        unitId: 1,
        purchasePrice: 0,
        sellingPrice: 0,
        isActive: true
      });
    }

    // Find or create inventory record
    const whId = warehouseId || 1;
    const [inventoryItem, isNew] = await Inventory.findOrCreate({
      where: { productId: product.id, warehouseId: whId },
      defaults: {
        productId: product.id,
        warehouseId: whId,
        quantity: quantity || 0,
        reservedQuantity: 0,
        availableQuantity: quantity || 0,
        lastRestocked: new Date()
      }
    });

    if (!isNew) {
      inventoryItem.quantity = quantity || 0;
      inventoryItem.availableQuantity = quantity || 0;
      inventoryItem.lastRestocked = new Date();
      await inventoryItem.save();
    }

    // Return with associations
    const result = await Inventory.findByPk(inventoryItem.id, {
      include: [
        { model: Product, include: [Category] },
        { model: Warehouse, attributes: ['id', 'name', 'code'] }
      ]
    });

    res.status(isNew ? 201 : 200).json(result);
  } catch (error) {
    console.error('Create stock error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/adjust', authenticate, async (req, res) => {
  try {
    const { productId, warehouseId, quantity, type, notes } = req.body;
    
    const inventory = await Inventory.findOne({
      where: { productId, warehouseId }
    });

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    await StockTransaction.create({
      productId,
      warehouseId,
      transactionType: type,
      quantity,
      notes
    });

    if (type === 'adjustment') {
      inventory.quantity = quantity;
      await inventory.save();
    }

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/transactions', authenticate, async (req, res) => {
  try {
    const transactions = await StockTransaction.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'sku']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Download Inventory Excel Template
router.get('/template', authenticate, async (req, res) => {
  try {
    const workbook = XLSX.utils.book_new();
    const templateData = [
      { Name: 'Example Product 1', SKU: 'PRD001', Category: 'Electrical', Warehouse: 'Main Warehouse', Quantity: 100 },
      { Name: 'Example Product 2', SKU: 'PRD002', Category: 'Plumbing', Warehouse: 'Main Warehouse', Quantity: 50 },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 30 }, // Name
      { wch: 15 }, // SKU
      { wch: 20 }, // Category
      { wch: 20 }, // Warehouse
      { wch: 10 }, // Quantity
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="inventory-template.xlsx"');
    res.send(buffer);
  } catch (error) {
    console.error('Template download error:', error);
    res.status(500).json({ message: 'Failed to generate template', error });
  }
});

// Excel/CSV Upload - Bulk Inventory Import
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse the Excel/CSV file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }

    // Fetch existing products, warehouses for mapping
    const products = await Product.findAll({ raw: true });
    const warehouses = await Warehouse.findAll({ raw: true });
    const categories = await Category.findAll({ raw: true });

    const productMap = new Map(products.map(p => [p.name.toLowerCase(), p]));
    const productSkuMap = new Map(products.filter(p => p.sku).map(p => [p.sku.toLowerCase(), p]));
    const warehouseMap = new Map(warehouses.map(w => [w.name.toLowerCase(), w.id]));
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));

    const created: any[] = [];
    const updated: any[] = [];
    const errors: { row: number; message: string }[] = [];
    const skipped: { row: number; name: string; reason: string }[] = [];

    // Detect format
    const isArrayFormat = rows.length > 0 && Array.isArray(rows[0]);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      try {
        let productName: string | null = null;
        let productSku: string | null = null;
        let categoryName: string | null = null;
        let warehouseName: string | null = null;
        let quantity = 0;

        if (isArrayFormat) {
          const arr = row as any[];
          categoryName = arr[1] ? String(arr[1]).trim() : null;
          const fullName = arr[2] ? String(arr[2]).trim() : null;
          warehouseName = 'Main Warehouse'; // default

          if (fullName) {
            const hsnMatch = fullName.match(/^\((\d+)\)\s*(.+)/);
            if (hsnMatch) {
              productSku = hsnMatch[1];
              productName = hsnMatch[2].trim();
            } else {
              productName = fullName;
            }
          }

          // Try to get quantity from stock column or default to 0
          quantity = parseInt(arr[5]) || 0;
        } else {
          productName = row['Name'] || row['name'] || row['Product Name'] || row['product_name'] || row['HSN CODE - Product Name'] || null;
          productSku = row['SKU'] || row['sku'] || null;
          categoryName = row['Category'] || row['category'] || null;
          warehouseName = row['Warehouse'] || row['warehouse'] || 'Main Warehouse';
          quantity = parseInt(row['Quantity'] || row['quantity'] || row['Stock'] || row['Qty'] || 0);

          // Parse HSN format
          const hsnCol = row['HSN CODE - Product Name'] || row['HSN CODE'] || null;
          if (hsnCol && !productName) {
            const hsnMatch = String(hsnCol).match(/^\((\d+)\)\s*(.+)/);
            if (hsnMatch) {
              productSku = hsnMatch[1];
              productName = hsnMatch[2].trim();
            } else {
              productName = String(hsnCol);
            }
          }
        }

        if (!productName) {
          skipped.push({ row: rowNum, name: 'N/A', reason: 'Missing product name' });
          continue;
        }

        // Find product by name or SKU
        let product = productMap.get(productName.toLowerCase());
        if (!product && productSku) {
          product = productSkuMap.get(productSku.toLowerCase());
        }

        if (!product) {
          // Try to auto-create product if category is known
          let catId = null;
          if (categoryName) {
            catId = categoryMap.get(categoryName.toLowerCase());
            if (!catId) {
              const newCat = await Category.create({ name: categoryName });
              catId = newCat.id;
              categoryMap.set(categoryName.toLowerCase(), newCat.id);
            }
          }

          if (!catId) {
            errors.push({ row: rowNum, message: `Product "${productName}" not found and no valid category to create it` });
            continue;
          }

          // Create the product
          product = await Product.create({
            name: productName,
            sku: productSku || null,
            categoryId: catId,
            unitId: 1, // default unit
            purchasePrice: 0,
            sellingPrice: 0,
            isActive: true
          });
          product = product.toJSON();
          productMap.set(productName.toLowerCase(), product);
        }

        // Find or default warehouse
        let warehouseId = warehouseMap.get(warehouseName?.toLowerCase());
        if (!warehouseId) {
          // Use first warehouse or create default
          if (warehouses.length > 0) {
            warehouseId = warehouses[0].id;
          } else {
            errors.push({ row: rowNum, message: 'No warehouse found. Please create a warehouse first.' });
            continue;
          }
        }

        // Upsert inventory record
        const [inventoryItem, isNew] = await Inventory.findOrCreate({
          where: { productId: product.id, warehouseId },
          defaults: {
            productId: product.id,
            warehouseId,
            quantity,
            reservedQuantity: 0,
            availableQuantity: quantity,
            lastRestocked: new Date()
          }
        });

        if (!isNew) {
          // Update quantity
          inventoryItem.quantity = quantity;
          inventoryItem.availableQuantity = quantity;
          inventoryItem.lastRestocked = new Date();
          await inventoryItem.save();
          updated.push(inventoryItem);
        } else {
          created.push(inventoryItem);
        }
      } catch (err: any) {
        errors.push({ row: rowNum, message: err.message || 'Unknown error' });
      }
    }

    res.json({
      message: `Imported ${created.length} new + ${updated.length} updated inventory items`,
      created: created.length,
      updated: updated.length,
      skipped: skipped.length,
      errors: errors.length,
      errorDetails: errors.slice(0, 20),
      skippedDetails: skipped.slice(0, 20)
    });
  } catch (error) {
    console.error('Inventory upload error:', error);
    res.status(500).json({ message: 'Failed to process Excel file', error });
  }
});

export default router;