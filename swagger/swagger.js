const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopEase API Documentation',
      version: '1.0.0',
      description: 'API documentation for ShopEase e-commerce platform',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // Replace with your actual server URL
        description: 'Development server',
      },
    ],
  },
  apis: [path.resolve(__dirname, './routes/*.js')], // Path to the route files
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = {
  swaggerSpec,
};
