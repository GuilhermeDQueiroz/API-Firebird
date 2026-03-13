const pool = require('../db/firebird');

exports.listarDocfat = (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    pool.get((err, db) => {

        if (err) return res.status(500).json(err);

        const query = `
      SELECT FIRST ${limit} SKIP ${skip} *
      FROM DOCUMENTO_FATURA
      ORDER BY CODIGO_DOCFAT DESC
    `;

        db.query(query, (err, result) => {

            db.detach();

            if (err) return res.status(500).json(err);

            res.json({
                page,
                limit,
                data: result
            });

        });

    });

};

exports.buscarPorId = (req, res) => {

    const id = req.params.id;

    pool.get((err, db) => {

        if (err) return res.status(500).json(err);

        db.query(
            'SELECT documento_fatura.codigo_docfat FROM documento_fatura',
            [id],
            (err, result) => {

                db.detach();

                if (err) return res.status(500).json(err);

                if (result.length === 0)
                    return res.status(404).json({ message: "Documento não encontrado" });

                res.json(result[0]);

            }
        );

    });

};