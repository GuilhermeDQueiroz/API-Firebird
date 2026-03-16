# Contexto do Projeto — API Firebird + Dashboard Vue

## Objetivo do projeto

Desenvolver uma **API REST em Node.js** para consultar dados de um **banco Firebird** utilizado em um ERP e consumir esses dados em um **dashboard web em Vue.js** com gráficos e filtros analíticos.

---

# Backend (API)

## Tecnologias

* Node.js
* Express
* Firebird 5
* node-firebird
* dotenv
* Swagger (documentação)

## Estrutura da API

```
api
│
├── index.js
│
├── routes
│   └── genericRoutes.js
│
├── controllers
│   └── genericController.js
│
├── db
│   └── firebird.js
│
└── config
    └── tabelas.js
```

## Funcionalidades implementadas

### Conexão com Firebird

Conexão direta utilizando **node-firebird** com pool de conexões.

---

### Rotas genéricas

Listar registros de qualquer tabela permitida:

```
GET /api/:tabela
```

Exemplo:

```
/api/DOCFAT
/api/ITEM
/api/CLIENTE
```

---

### Buscar registro por ID

```
GET /api/:tabela/:id
```

Exemplo:

```
/api/DOCFAT/55
```

A API assume o padrão:

```
CODIGO_<TABELA>
```

Exemplo SQL:

```
SELECT * FROM DOCFAT WHERE CODIGO_DOCFAT = ?
```

---

### Limitar quantidade de registros

```
/api/DOCFAT?limit=20
```

SQL:

```
SELECT FIRST 20 * FROM DOCFAT
```

---

### Filtros dinâmicos

A API permite filtros através de query params.

Exemplo:

```
/api/ITEM?CODIGO_ITEM=10
```

ou múltiplos filtros:

```
/api/ITEM?CODIGO_ITEM=0&GRUPORESULTADO_ITEM=0
```

---

### Segurança

Foi implementada uma lista de **tabelas permitidas**.

Arquivo:

```
config/tabelas.js
```

Exemplo:

```
module.exports = [
  "DOCFAT",
  "CLIENTE",
  "ITEM"
];
```

Se uma tabela não estiver na lista:

```
403 - Tabela não permitida
```

---

### Proteção contra SQL Injection

Consultas utilizam parâmetros preparados:

```
db.query(sql, [valor])
```

---

### Documentação

Swagger disponível em:

```
http://localhost:3000/docs
```

---

# Dados utilizados

A principal tabela utilizada para o dashboard é:

```
DOCFAT
```

Campos relevantes:

```
CODIGO_DOCFAT
CLIENTE_DOCFAT
DTEMISSAO_DOCFAT
VLRBRUTO_DOCFAT
VLRLIQUIDO_DOCFAT
QTDETOTALITENS_DOCFAT
STATUS_DOCFAT
```

Essa tabela representa **documentos de faturamento / vendas**.

---

# Frontend (Dashboard)

## Tecnologias

* Vue.js
* Vue Router
* Pinia
* Vuetify
* ApexCharts
* Axios

Projeto criado com **Vite**.

---

## Estrutura do front-end

```
front-end
└── dashboard
    │
    ├── src
    │
    ├── api
    │   └── api.js
    │
    ├── stores
    │   └── vendasStore.js
    │
    ├── views
    │   └── Dashboard.vue
    │
    ├── components
    │
    └── router
        └── index.js
```

---

## Comunicação com API

Arquivo:

```
src/api/api.js
```

```
axios baseURL

http://localhost:3000/api
```

---

## Store de vendas (Pinia)

Responsável por:

* carregar dados DOCFAT
* armazenar vendas
* calcular métricas

Exemplo de métricas:

* total de vendas
* quantidade de documentos
* ticket médio

---

## Dashboard planejado

Painel de vendas baseado na tabela **DOCFAT**.

### Filtros

* cliente
* data inicial
* data final

---

### Indicadores

Cards com:

* total faturado
* quantidade de vendas
* ticket médio

---

### Visualizações

Gráfico:

* vendas por dia
* faturamento por período

Tabela:

* documentos DOCFAT

---

# Estrutura geral do projeto

```
projeto
│
├── api
│   ├── routes
│   ├── controllers
│   ├── db
│   └── config
│
└── front-end
    └── dashboard
```

---

# Estado atual do projeto

API:

✔ funcionando
✔ rotas genéricas
✔ filtros dinâmicos
✔ limite de registros
✔ busca por ID
✔ segurança por tabela permitida
✔ documentação Swagger

Frontend:

✔ projeto Vue criado
✔ Vite rodando
✔ Router configurado
✔ início da estrutura do dashboard

---

# Próximos passos

Melhorias previstas:

API

* filtros de data diretamente no SQL
* paginação
* ordenação
* endpoints analíticos

Frontend

* filtros de cliente e período
* gráficos ApexCharts
* cards de métricas
* tabela Vuetify
* dashboard completo de vendas

---

# Objetivo final

Criar um **dashboard analítico de vendas do ERP** consumindo dados do Firebird através da API REST.
