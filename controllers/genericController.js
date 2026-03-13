const pool = require('../db/firebird');
const tabelasPermitidas = require('../config/tabelas');

// listar registros
exports.listar = (req, res) => {

  const tabela = req.params.tabela.toUpperCase();
  const limit = parseInt(req.query.limit) || 20;

  if (!tabelasPermitidas.includes(tabela)) {
    return res.status(403).json({ erro: "Tabela não permitida" });
  }

  const filtros = { ...req.query };
  delete filtros.limit;

  let where = "";
  let valores = [];

  const campos = Object.keys(filtros);

  if (campos.length > 0) {

    const condicoes = campos.map(campo => {
      valores.push(filtros[campo]);
      return `${campo} = ?`;
    });

    where = "WHERE " + condicoes.join(" AND ");
  }

  const sql = `SELECT FIRST ${limit} * FROM ${tabela} ${where}`;

  pool.get((err, db) => {

    if (err) return res.status(500).json(err);

    db.query(sql, valores, (err, result) => {

      db.detach();

      if (err) return res.status(500).json(err);

      res.json(result);

    });

  });

};


// buscar por ID
exports.buscarPorId = (req, res) => {

  const tabela = req.params.tabela.toUpperCase();
  const id = req.params.id;

  if (!tabelasPermitidas.includes(tabela)) {
    return res.status(403).json({ erro: "Tabela não permitida" });
  }

  pool.get((err, db) => {

    if (err) return res.status(500).json(err);

    const sql = `SELECT * FROM ${tabela} WHERE CODIGO_${tabela} = ?`;

    db.query(sql, [id], (err, result) => {

      db.detach();

      if (err) return res.status(500).json(err);

      res.json(result);

    });

  });

};