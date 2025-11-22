# Projeto: Cardápio Digital - SPACE BURGER

Este é um sistema completo de cardápio digital desenvolvido em Node.js, Express e MySQL, com um front-end em JavaScript puro. O sistema não é apenas um cardápio, mas uma plataforma de gerenciamento de lojas com múltiplos níveis de acesso.

## Tecnologias Utilizadas

* **Front-end:** HTML, CSS, JavaScript (Vanilla JS)
* **Back-end:** Node.js, Express.js
* **Banco de Dados:** MySQL
* **Bibliotecas (Back-end):**
    * `express-session` (para autenticação e sessões de login)
    * `bcrypt` (para criptografia de senhas)
    * `multer` (para upload de imagens de produtos)
    * `mysql2/promise` (para conexão com o banco)
    * `cors` (para gerenciamento de permissões)

---

## O que foi feito até agora (Funcionalidades)

O projeto está dividido em três níveis de acesso com funcionalidades distintas:

### 1. Sistema de Autenticação & Cargos (`Roles`)

Um sistema de login seguro que usa sessões e `bcrypt` para verificar a senha. Ao logar, o sistema identifica o "cargo" do usuário e o redireciona para o painel correto.

* **`superadmin`:** Cargo de nível mais alto, com acesso à criação de novas lojas.
* **`store`:** Cargo de "admin de loja", com acesso ao painel de gerenciamento de pedidos e produtos.

### 2. Painel do Super Admin (`/superadmin.html`)

Página dedicada ao dono do sistema (você).
* Protegida por middleware `isSuperAdmin` (só `superadmin` pode entrar).
* **Cadastro de Lojas:** Permite cadastrar novas contas de administrador (`store`) no banco de dados.
* Navbar com botão "Sair" (Logout) funcional.

### 3. Painel do Admin da Loja (`/admin.html`)

O "Painel da Cozinha", onde o gerenciamento da loja acontece.
* Protegido por middleware `isStoreAdmin` (só o cargo `store` pode entrar).

**Gestão de Pedidos:**
* **Lista "Limpa":** A API busca apenas pedidos "Pendentes" ou "Em Preparo". Pedidos concluídos ou cancelados não poluem a tela.
* **Fluxo de Cozinha:** Permite ao admin "Aceitar" (muda status para `Em Preparo`), "Cancelar" ou "Finalizar" (muda status para `Concluído`) um pedido.
* **Remoção Automática:** Pedidos "Finalizados" ou "Cancelados" somem da tela em tempo real, sem precisar recarregar a página.

**Gestão de Produtos (CRUD):**
* CRUD Completo: Permite Adicionar, Editar e Excluir produtos.
* **Upload de Imagens:** Faz upload real de arquivos de imagem (`.png`, `.jpg`) para o servidor usando `multer`.
* **Organização Visual:** Lista os produtos em tabelas separadas por categoria (Lanches, Combos, Porções, Bebidas) para facilitar a visualização.

**Financeiro:**
* **Relatório do Dia:** Um botão na navbar gera um relatório (`alert`) com o total de pedidos concluídos hoje, o faturamento total do dia e o ticket médio.

### 4. Interface do Cliente (`/index.html`)

A página pública que o cliente vê.
* Carrega produtos dinamicamente da API (`GET /api/products`).
* Permite ao cliente enviar um pedido para a API (`POST /api/orders`).
* **Navbar Dinâmica:** Um "escudo" (botão Admin) aparece na navbar **apenas** se um usuário (`store` ou `superadmin`) estiver logado. O link desse botão leva inteligentemente para a página de admin correta (`/admin.html` ou `/superadmin.html`).

---

## Como Iniciar o Sistema (Instruções)

Para rodar este projeto, você precisa de um servidor MySQL (como XAMPP, WAMP ou MAMP) e do Node.js instalados.

### 1. Banco de Dados (MySQL)

1.  Inicie seu servidor MySQL (ex: no painel do XAMPP, inicie o "MySQL").
2.  Abra seu gerenciador de banco de dados (ex: `phpMyAdmin`).
3.  Crie um novo banco de dados chamado `cardapio_online`.
4.  Selecione este banco e vá para a aba "Importar".
5.  Faça o upload do arquivo `cardapio_online.sql` (que está na raiz do projeto) e execute.
6.  *Opcional:* Se a sua senha do MySQL não for em branco, atualize o arquivo `backend/server.js` com seu usuário e senha.

### 2. Back-end (Node.js)

1.  Abra um terminal na pasta do projeto.
2.  Navegue até a pasta do back-end: `cd backend`
3.  Instale todas as dependências: `npm install`
4.  Inicie o servidor: `node server.js`
5.  Se tudo der certo, você verá a mensagem: `Back-end rodando em http://localhost:3001`.

### 3. Front-end (Como Acessar)

Você **não** precisa de um "Live Server" do VS Code. O nosso back-end já está servindo os arquivos.

* **Página do Cliente:** Abra no navegador: `http://localhost:3001/`
* **Página de Login:** Abra no navegador: `http://localhost:3001/login.html`

### Contas Padrão

* **Super Admin:**
    * **Usuário:** `admin`
    * **Senha:** `[ADICIONE A SENHA QUE VOCÊ CADASTROU AQUI]` (Lembre-se de que alteramos ela manualmente).
* **Admin da Loja:**
    * Cadastre uma nova conta (ex: `loja1`) através do painel do `superadmin` (`/superadmin.html`).

---

## Próximos Passos (O que pretendo continuar fazendo)

* **Dashboard de Vendas:** Evoluir o "Relatório do Dia" para um dashboard visual no `admin.html`, com gráficos (ex: Chart.js) mostrando faturamento semanal.
* **Pedidos em Tempo Real:** Implementar `WebSockets` (Socket.io) para que novos pedidos "pulem" na tela do `admin.html` em tempo real, sem a necessidade de recarregar a página.
* **Hospedagem (Deployment):** Fazer o deploy do projeto na nuvem, usando **Railway** para o Back-end (Node.js) e o Banco de Dados (MySQL), e **Netlify** para o Front-end (HTML/CSS/JS).