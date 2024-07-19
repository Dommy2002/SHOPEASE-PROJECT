// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/product'); // Products routes

const ordersRouter = require('./routes/orders'); // Orders routes

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const db = require('./db'); // db.js contains database connection logic


// Initialize Express app
const app = express();
const port = process.env.PORT || 3000; // Use environment port or default to 3000

// Middleware to parse incoming request bodies as JSON
app.use(bodyParser.json());

// Swagger definition options
const swaggerOptions = {
  definition: { // OpenAPI 3.0.0 specification
    openapi: '3.0.0',
    info: {
      title: 'ShopEase API Documentation', // Title of the documentation
      version: '1.0.0', // Version of the API
      description: 'API documentation for ShopEase e-commerce platform', // Description of the API
    },
    servers: [
      {
        url: `http://localhost:${port}/api`, // Server URL for API
        description: 'Development server', // Description of the server
      },
    ],
  },
  apis: [path.resolve(__dirname, './routes/*.js')], // Path to the route files for API documentation
};

// Initialize swagger-jsdoc with the options
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes
app.use('/api/orders', ordersRouter); // Mount orders router at /api/orders
app.use('/api/products', productsRouter); // Mount products router at /api/products

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ message: 'Internal Server Error' }); // Send 500 Internal Server Error response
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Log server start message
});

// Export the app module
module.exports = app;
