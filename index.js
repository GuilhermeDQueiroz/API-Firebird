require('dotenv').config();
const express = require('express');
const Firebird = require('node-firebird');

const app = express();
app.use(express.json());

console.log("API iniciando...");

const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  lowercase_keys: false,
  role: null,
  pageSize: 4096
};

// Rota de teste
app.get('/', (req, res) => {
  res.send('API conectada ao Firebird 🚀');
});

// Rota consultando dados
app.get('/clientes', (req, res) => {
  Firebird.attach(options, function (err, db) {
    if (err) return res.status(500).json(err);

    db.query('SELECT FIRST 10 * FROM DOCUMENTO_FATURA', function (err, result) {
      db.detach();

      if (err) return res.status(500).json(err);

      res.json(result);
    });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});