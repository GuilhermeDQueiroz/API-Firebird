require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const genericRoutes = require('./routes/genericRoutes');

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// registrar rotas da API
app.use('/api', genericRoutes);

// swagger config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Firebird ERP",
      version: "1.0.0",
      description: "API para consulta de documentos"
    }
  },
  apis: []
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
  console.log("Swagger em http://localhost:3000/docs");
});

/*require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//const docfatRoutes = require('./routes/docfatRoutes');

const tabelasPermitidas = require('./config/tabelas');

const app = express();
app.use(express.json());

//app.use('/', docfatRoutes);

// swagger config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Firebird ERP",
      version: "1.0.0",
      description: "API para consulta de documentos"
    }
  },
  apis: []
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
  console.log("Swagger em http://localhost:3000/docs");
});*/