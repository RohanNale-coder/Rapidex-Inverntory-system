import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import Product from '../models/Product';
import Category from '../models/Category';
import Brand from '../models/Brand';
import Unit from '../models/Unit';
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

router.get('/', authenticate, async (req, res) => {
  try {
    const products = await Product.findAll({ include: ['Category', 'Brand', 'Unit'] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Excel/CSV Upload - Bulk Product Import
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

    // Fetch existing categories, brands, units for mapping
    const categories = await Category.findAll({ raw: true });
    const brands = await Brand.findAll({ raw: true });
    const units = await Unit.findAll({ raw: true });

    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));
    const brandMap = new Map(brands.map(b => [b.name.toLowerCase(), b.id]));
    const unitMap = new Map(units.map(u => [u.name.toLowerCase(), u.id]));

    const created: any[] = [];
    const errors: { row: number; message: string }[] = [];
    const skipped: { row: number; name: string; reason: string }[] = [];

    // Detect if this is a simple column-based format (array of values) or header-based (object)
    const isArrayFormat = rows.length > 0 && Array.isArray(rows[0]);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because row 1 is header

      try {
        let name: string | null = null;
        let categoryName: string | null = null;
        let brandName: string | null = null;
        let unitName: string | null = null;
        let purchasePrice = 0;
        let sellingPrice = 0;
        let sku: string | null = null;
        let barcode: string | null = null;
        let description: string | null = null;

        if (isArrayFormat) {
          // Array format: [empty, Category, "HSN - Product Name", CostPrice, SalePrice, Date, Brand/Supplier]
          const arr = row as any[];
          categoryName = arr[1] ? String(arr[1]).trim() : null;
          const productFullName = arr[2] ? String(arr[2]).trim() : null;
          brandName = arr[6] ? String(arr[6]).trim() : null;
          unitName = 'Pcs'; // Default unit

          if (productFullName) {
            // Extract HSN code as SKU if present, and name
            const hsnMatch = productFullName.match(/^\((\d+)\)\s*(.+)/);
            if (hsnMatch) {
              sku = hsnMatch[1];
              name = hsnMatch[2].trim();
              description = productFullName;
            } else {
              name = productFullName;
            }
          }

          // Parse prices (may contain "/unit" suffix)
          const costRaw = arr[3];
          const saleRaw = arr[4];
          if (costRaw != null) {
            const costStr = String(costRaw).replace(/[^0-9.]/g, '');
            purchasePrice = parseFloat(costStr) || 0;
          }
          if (saleRaw != null) {
            const saleStr = String(saleRaw).replace(/[^0-9.]/g, '');
            sellingPrice = parseFloat(saleStr) || 0;
          }
        } else {
          // Header-based format: { Name: "...", Category: "...", etc. }
          name = row['Name'] || row['name'] || row['Product Name'] || row['product_name'] || row['HSN CODE - Product Name'] || null;
          categoryName = row['Category'] || row['category'] || null;
          // Check __EMPTY columns for brand/date (from merged/unrecognized headers)
          brandName = row['Brand'] || row['brand'] || row['__EMPTY_2'] || row['__EMPTY_3'] || null;
          unitName = row['Unit'] || row['unit'] || 'Pcs';

          // Also check the HSN CODE column format
          const hsnCol = row['HSN CODE - Product Name'] || row['HSN CODE'] || null;
          if (hsnCol && !name) {
            const hsnMatch = String(hsnCol).match(/^\((\d+)\)\s*(.+)/);
            if (hsnMatch) {
              sku = hsnMatch[1];
              name = hsnMatch[2].trim();
              description = String(hsnCol);
            } else {
              name = String(hsnCol);
            }
          }

          sku = sku || row['SKU'] || row['sku'] || row['Sku'] || null;
          barcode = row['Barcode'] || row['barcode'] || null;
          description = description || row['Description'] || row['description'] || null;

          const costRaw = row['CostPrice'] || row['costPrice'] || row['Purchase Price'] || row['purchasePrice'] || row['purchase_price'] || 0;
          const saleRaw = row['SalePrice'] || row['salePrice'] || row['Selling Price'] || row['sellingPrice'] || row['selling_price'] || 0;

          if (typeof costRaw === 'string') {
            purchasePrice = parseFloat(costRaw.replace(/[^0-9.]/g, '')) || 0;
          } else {
            purchasePrice = parseFloat(costRaw) || 0;
          }
          if (typeof saleRaw === 'string') {
            sellingPrice = parseFloat(saleRaw.replace(/[^0-9.]/g, '')) || 0;
          } else {
            sellingPrice = parseFloat(saleRaw) || 0;
          }
        }

        if (!name) {
          skipped.push({ row: rowNum, name: 'N/A', reason: 'Missing product name' });
          continue;
        }

        // Map category name to ID
        let categoryId = row['categoryId'] || row['CategoryId'] || null;
        if (!categoryId && categoryName) {
          categoryId = categoryMap.get(categoryName.toLowerCase());
          if (!categoryId) {
            // Auto-create category if it doesn't exist
            const newCat = await Category.create({ name: categoryName });
            categoryId = newCat.id;
            categoryMap.set(categoryName.toLowerCase(), newCat.id);
          }
        }

        // Map brand name to ID
        let brandId = row['brandId'] || row['BrandId'] || null;
        if (!brandId && brandName) {
          brandId = brandMap.get(brandName.toLowerCase());
          if (!brandId) {
            const newBrand = await Brand.create({ name: brandName });
            brandId = newBrand.id;
            brandMap.set(brandName.toLowerCase(), newBrand.id);
          }
        }

        // Map unit name to ID
        let unitId = row['unitId'] || row['UnitId'] || null;
        if (!unitId && unitName) {
          unitId = unitMap.get(unitName.toLowerCase());
          if (!unitId) {
            const newUnit = await Unit.create({ name: unitName, abbreviation: unitName.substring(0, 3).toUpperCase() });
            unitId = newUnit.id;
            unitMap.set(unitName.toLowerCase(), newUnit.id);
          }
        }

        if (!categoryId) {
          errors.push({ row: rowNum, message: `Product "${name}" has no valid category` });
          continue;
        }
        if (!unitId) {
          errors.push({ row: rowNum, message: `Product "${name}" has no valid unit` });
          continue;
        }

        const productData = {
          name,
          sku: sku || null,
          barcode: barcode || null,
          description: description || null,
          purchasePrice,
          sellingPrice,
          mrp: row['MRP'] || row['mrp'] ? parseFloat(row['MRP'] || row['mrp']) : null,
          minStockLevel: parseInt(row['Min Stock'] || row['minStockLevel'] || row['min_stock_level'] || 0),
          reorderLevel: parseInt(row['Reorder Level'] || row['reorderLevel'] || row['reorder_level'] || 10),
          categoryId,
          brandId: brandId || null,
          unitId,
          isActive: true
        };

        const product = await Product.create(productData);
        created.push(product);
      } catch (err: any) {
        errors.push({ row: rowNum, message: err.message || 'Unknown error' });
      }
    }

    res.json({
      message: `Imported ${created.length} products successfully`,
      created: created.length,
      skipped: skipped.length,
      errors: errors.length,
      errorDetails: errors.slice(0, 20), // Return first 20 errors
      skippedDetails: skipped.slice(0, 20)
    });
  } catch (error) {
    console.error('Excel upload error:', error);
    res.status(500).json({ message: 'Failed to process Excel file', error });
  }
});

// Categories
router.get('/categories', authenticate, async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/categories', authenticate, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Brands
router.get('/brands', authenticate, async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/brands', authenticate, async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Units
router.get('/units', authenticate, async (req, res) => {
  try {
    const units = await Unit.findAll();
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/units', authenticate, async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;