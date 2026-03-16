# API Firebird ERP

API REST desenvolvida em **Node.js + Express** para consulta de dados em banco **Firebird**, com rotas genéricas, filtros dinâmicos e estrutura organizada para integração com dashboards e aplicações web.

---

# 🚀 Tecnologias utilizadas

* Node.js
* Express
* Firebird
* node-firebird
* Swagger (documentação da API)

---

# 📂 Estrutura do projeto

```
project
│
├── index.js
│
├── config
│   └── tabelas.js
│
├── db
│   └── firebird.js
│
├── controllers
│   └── genericController.js
│
└── routes
    └── genericRoutes.js
```

Separação por responsabilidades:

| Camada      | Função                    |
| ----------- | ------------------------- |
| Routes      | definição dos endpoints   |
| Controllers | lógica das requisições    |
| DB          | conexão com o banco       |
| Config      | configurações e segurança |

---

# 🔌 Conexão com Firebird

A conexão com o banco é realizada utilizando a biblioteca **node-firebird**, com **pool de conexões** para melhorar desempenho e evitar abertura excessiva de conexões.

---

# 🌐 Endpoints da API

## Listar registros de uma tabela

```
GET /api/:tabela
```

Exemplo:

```
/api/DOCFAT
/api/CLIENTE
/api/ITEM
```

---

## Buscar registro por ID

```
GET /api/:tabela/:id
```

Exemplo:

```
/api/DOCFAT/55
```

SQL executado:

```
SELECT * FROM DOCFAT WHERE CODIGO_DOCFAT = ?
```

---

## Limitar quantidade de registros

```
/api/DOCFAT?limit=10
```

SQL:

```
SELECT FIRST 10 * FROM DOCFAT
```

---

# 🔎 Filtros dinâmicos

A API permite filtrar registros utilizando **query parameters**, sem necessidade de criar novas rotas.

Exemplos:

```
/api/ITEM?CODIGO_ITEM=0
```

```
/api/ITEM?CODIGO_ITEM=0&GRUPORESULTADO_ITEM=0
```

SQL gerado:

```
SELECT * FROM ITEM
WHERE CODIGO_ITEM = ?
AND GRUPORESULTADO_ITEM = ?
```

Também é possível combinar filtros com limite:

```
/api/ITEM?GRUPORESULTADO_ITEM=0&limit=10
```

---

# 🔐 Segurança

Para evitar acesso indevido a tabelas do banco, foi implementada uma lista de **tabelas permitidas**.

Arquivo:

```
config/tabelas.js
```

Exemplo:

```javascript
module.exports = [
  "DOCFAT",
  "CLIENTE",
  "PRODUTO",
  "ITEM"
];
```

Caso uma tabela não permitida seja solicitada, a API retorna:

```
403 - Tabela não permitida
```

---

# 🛡 Proteção contra SQL Injection

Consultas que utilizam parâmetros (como busca por ID e filtros) usam **prepared statements**:

```
db.query(sql, [valor])
```

Isso evita injeção de SQL.

---

# 📑 Documentação da API

A API possui documentação automática com **Swagger**.

Disponível em:

```
http://localhost:3000/docs
```

---

# 📊 Integração com Front-end

A API foi preparada para consumo por dashboards e aplicações web.

Stack prevista para o front-end:

* Vue.js
* Vue Router
* Pinia
* Vuetify
* ApexCharts

Fluxo de dados:

```
Firebird
   ↓
Node API
   ↓
Pinia Store
   ↓
Vue Components
   ↓
Charts / Dashboards
```

---

# 📈 Melhorias implementadas

* Estrutura modular (routes + controllers)
* Rotas genéricas para qualquer tabela
* Busca por ID
* Limitação de registros
* Filtros dinâmicos
* Pool de conexões
* Validação de tabelas permitidas
* Proteção contra SQL injection
* Documentação Swagger

---

# 📌 Possíveis melhorias futuras

* paginação (`page`)
* ordenação (`sort`)
* filtros avançados
* endpoints específicos para dashboards
* autenticação (JWT)
* cache para consultas pesadas

---

# 👨‍💻 Autor

Projeto desenvolvido para estudo e integração com dashboards de ERP.
