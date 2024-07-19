const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming this is your PostgreSQL connection pool

/**
 * @swagger
 * /orders/total_sales/{id}:
 *   get:
 *     summary: Calculate total sales for a specific order
 *     description: Retrieves the total sales for a specific order by its ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to calculate the total sales for
 *     responses:
 *       200:
 *         description: Total sales for the specified order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_sales:
 *                   type: number
 *                   format: float
 *                   example: 1999.99
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving the total sales
 */
router.get('/total_sales/:id', async (req, res, next) => {
    const orderId = parseInt(req.params.id, 10);
    try {
        // Query to calculate total sales for a specific order
        const { rows } = await db.query('SELECT unitssold * unitprice AS total_sales FROM orders WHERE order_id = $1', [orderId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const totalSales = rows[0]?.total_sales || 0;
        res.json({ total_sales: totalSales });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});


/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: Retrieves a specific order by its ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                   example: 1
 *                 order_date:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-07-19T15:00:00Z
 *                 product_id:
 *                   type: integer
 *                   example: 1001
 *                 unitssold:
 *                   type: integer
 *                   example: 10
 *                 unitprice:
 *                   type: number
 *                   format: float
 *                   example: 19.99
 *                 last_updated:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-07-19T15:00:00Z
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving the order
 */

// GET a specific order by ID
router.get('/:id', async (req, res, next) => {
    const orderId = req.params.id;
    try {
        const { rows } = await db.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(rows[0]); // Send the retrieved order as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

/**
 * @swagger
 * /products/{id}/total_sales:
 *   get:
 *     summary: Calculate total sales for a specific product
 *     description: Retrieves the total sales for a specific product based on its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to calculate total sales for.
 *     responses:
 *       '200':
 *         description: Total sales for the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_sales:
 *                   type: number
 */
router.get('/products/:id/total_sales', async (req, res, next) => {
    const productId = req.params.id;

    try {
        const query = `
            SELECT SUM(unitssold * unitprice) AS total_sales
            FROM orders
            WHERE product_id = $1;
        `;
        const { rows } = await pool.query(query, [productId]);

        const totalSales = rows[0]?.total_sales || 0;

        res.json({ total_sales: totalSales });
    } catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Retrieve a specific order by ID
 *     description: Retrieves details of a specific order by its ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order to retrieve.
 *     responses:
 *       '200':
 *         description: Details of the order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                 order_date:
 *                   type: string
 *                   format: date
 *                 product_id:
 *                   type: integer
 *                 unitssold:
 *                   type: integer
 *                 unitprice:
 *                   type: number
 *                   format: float
 *       '404':
 *         description: Order not found
 */
router.get('/orders/:id', async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const query = `
            SELECT order_id, order_date, product_id, unitssold, unitprice
            FROM orders
            WHERE order_id = $1;
        `;
        const { rows, rowCount } = await pool.query(query, [orderId]);

        if (rowCount === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = rows[0];
        res.json(order);
    } catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update specific details of an order by ID
 *     description: Update only `unitssold` and `unitprice` of a specific order by its ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unitssold:
 *                 type: integer
 *               unitprice:
 *                 type: number
 *                 format: float
 *             required:
 *               - unitssold
 *               - unitprice
 *     responses:
 *       '200':
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order updated successfully
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Order not found
 */
router.put('/:id', async (req, res, next) => {
    const orderId = parseInt(req.params.id, 10);
    const { unitssold, unitprice } = req.body;

    // Detailed validation
    if (isNaN(orderId) || orderId <= 0) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    if (unitssold == null || unitssold < 0) {
        return res.status(400).json({ error: 'Invalid unitssold value' });
    }

    if (unitprice == null || unitprice < 0) {
        return res.status(400).json({ error: 'Invalid unitprice value' });
    }

    try {
        // Update the order in the database
        const updateQuery = `
            UPDATE orders
            SET unitssold = $1, unitprice = $2
            WHERE order_id = $3;
        `;
        const result = await db.query(updateQuery, [unitssold, unitprice, orderId]);

        // Check if any rows were affected
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        console.error(err); // Log the error for debugging
        next(err); // Pass any errors to the error handling middleware
    }
});
module.exports = router;
