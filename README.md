API para consulta ao banco Firebird

1️⃣ Criação da API em Node.js

Criação de uma API REST usando:

Node.js

Express.js

A API roda localmente:

http://localhost:3000


Responsável por consultar dados do banco Firebird e disponibilizar via HTTP.

2️⃣ Conexão com banco Firebird

Foi criada a conexão usando a biblioteca:

node-firebird

Ela permite que o Node execute SQL diretamente no Firebird.

Exemplo de consulta executada pela API:

SELECT FIRST 20 * FROM DOCFAT

3️⃣ Pool de conexões

Implementamos pool de conexão, que:

evita abrir conexão nova a cada requisição

melhora performance

reduz carga no banco

Fluxo:

API request
     ↓
Pool de conexões
     ↓
Firebird

4️⃣ Estrutura organizada do projeto

A API foi reorganizada seguindo uma arquitetura mais profissional:

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


Separando responsabilidades:

Camada	Função
Routes	define endpoints
Controllers	lógica da API
DB	conexão com banco
Config	configurações
5️⃣ Rotas genéricas para qualquer tabela

Criado rotas dinâmicas:

Listar registros
GET /api/:tabela


Exemplo:

/api/DOCFAT
/api/CLIENTE

Buscar por ID
GET /api/:tabela/:id


Exemplo:

/api/DOCFAT/55


SQL executado:

SELECT * FROM DOCFAT WHERE CODIGO_DOCFAT = ?

6️⃣ Limitação de resultados

Adicionado limite de registros via query param:

/api/DOCFAT?limit=10


SQL gerado:

SELECT FIRST 10 * FROM DOCFAT


Isso evita consultas muito pesadas.

7️⃣ Segurança: controle de tabelas permitidas

Criado um arquivo:

config/tabelas.js


Exemplo:

module.exports = [
  "DOCFAT",
  "CLIENTE",
  "PRODUTO"
];


A API valida:

if (!tabelasPermitidas.includes(tabela)) {
  return res.status(403).json({ erro: "Tabela não permitida" });
}


Isso evita:

acesso a tabelas internas

SQL injection via nome de tabela


8️⃣ Uso de parâmetros seguros no SQL

Para evitar SQL injection:

db.query(sql, [id])


Em vez de concatenar valores diretamente no SQL.


9️⃣ Documentação automática

Implementado documentação com:

Swagger UI

swagger-jsdoc

Disponível em:

http://localhost:3000/docs


🔟 Preparação para consumo no front-end

A API foi preparada para ser consumida por um dashboard em:

Vue.js

Vue Router

Pinia

Vuetify

ApexCharts

Fluxo de dados:

Firebird
   ↓
Node API
   ↓
Pinia Store
   ↓
Vue Components
   ↓
ApexCharts / Vuetify

🚀 Recursos a API já possui

✅ Conexão com Firebird
✅ Pool de conexões
✅ Rotas dinâmicas por tabela
✅ Busca por ID
✅ Limite de resultados
✅ Segurança de tabelas
✅ Estrutura profissional (routes + controllers)
✅ Documentação Swagger
✅ Pronta para dashboards Vue

📈 Melhorias futuras possíveis

Algumas melhorias a serem implementadas:

filtros dinâmicos
/api/DOCFAT?CLIENTE_DOCFAT=3

ordenação
/api/DOCFAT?sort=DTEMISSAO_DOCFAT

paginação
/api/DOCFAT?page=2&limit=20

endpoints específicos para dashboard
/api/dashboard/faturamento-mensal
/api/dashboard/top-clientes
/api/dashboard/top-produtos


Isso melhora muito a performance do painel.

✅ Conclusão:
Uma API genérica para Firebird pronta para integração com dashboards e sistemas web, com arquitetura organizada e segurança básica aplicada.
