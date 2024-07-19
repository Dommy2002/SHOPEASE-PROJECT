const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection pool


/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 * 
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         product_id:
 *           type: integer
 *         product_name:
 *           type: string
 *       required:
 *         - product_name
 * 
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     description: Retrieve a list of all products from the database.
 *     responses:
 *       '200':
 *         description: A JSON array of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 *   post:
 *     summary: Add a new product
 *     description: Add a new product to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '201':
 *         description: Successfully created a new product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *
 * /products/{id}:
 *   get:
 *     summary: Retrieve a specific product by ID
 *     description: Retrieve details of a specific product based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to retrieve.
 *     responses:
 *       '200':
 *         description: Details of the product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *
 *   put:
 *     summary: Update an existing product
 *     description: Update details of an existing product based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: Updated details of the product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product from the database based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to delete.
 *     responses:
 *       '200':
 *         description: Product deleted successfully.
 */

// GET all products
router.get('/', async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM product ORDER BY product_id');
        res.json(rows); // Send the retrieved products as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// GET a specific product by ID
router.get('/:id', async (req, res, next) => {
    const productId = req.params.id;
    try {
        const { rows } = await db.query('SELECT * FROM product WHERE product_id = $1', [productId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(rows[0]); // Send the retrieved product as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// POST add a new product
router.post('/', async (req, res, next) => {
  const { product_name } = req.body;
  try {
    const { rows } = await db.query(  // Use db.query if pool is stored in db
      'INSERT INTO product (product_name) VALUES ($1) RETURNING *',
      [product_name]
    );
    res.status(201).json(rows[0]); // Send the newly added product as JSON response with status 201 (Created)
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
});


// PUT update an existing product
router.put('/:id', async (req, res, next) => {
    const productId = req.params.id;
    const { product_name} = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE product SET product_name = $1 WHERE product_id = $2 RETURNING *',
            [product_name, productId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(rows[0]); // Send the updated product as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// DELETE a product
router.delete('/:id', async (req, res, next) => {
    const productId = req.params.id;
    try {
        const { rows } = await db.query('DELETE FROM product WHERE product_id = $1 RETURNING *', [productId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

module.exports = router; // Export the router object to be used by the main application
