const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');

const port = 3001;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: 'EUSOUUMJOVEMDE!@ANOSCOMMUITOSSONHOSEMETASNAVIDA!!!',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Não autorizado. Faça login.' });
    }
    res.redirect('/login.html');
};

const isStoreAdmin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login.html');
    }
    if (req.session.user.role === 'store') {
        return next();
    }
    return res.status(403).send('Acesso proibido: Esta página é apenas para administradores de loja.');
};

const isSuperAdmin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login.html');
    }

    if (req.session.user.role === 'superadmin') {
        return next();
    }
    return res.status(403).send('Acesso proibido: Somente para Super Admins.');
};

app.use(express.static(path.join(__dirname, '..'))); 
app.use('/login.html', express.static(path.join(__dirname, '..', 'login.html')));


app.get('/admin.html', isStoreAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin.html'));
});

app.get('/superadmin.html', isSuperAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'superadmin.html'));
});

app.get('/superadmin.html', isSuperAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'superadmin.html'));
});


app.get('/admin-config.html', isStoreAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin-config.html'));
});

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cardapio_online',
    decimalNumbers: true
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'img')); 
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/webp") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Formato de arquivo inválido!'));
        }
    }
});

app.get('/api/store-config', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.execute('SELECT * FROM store_config WHERE id = 1');
        connection.release();

        if (rows.length > 0) {
            res.json({ success: true, data: rows[0] });
        } else {
            res.status(404).json({ success: false, error: 'Configuração da loja não encontrada.' });
        }
    } catch (error) {
        console.error('Erro ao buscar config da loja:', error);
        res.status(500).json({ error: 'Erro ao buscar config da loja.' });
    }
});

app.put('/api/store-config', isStoreAdmin, async (req, res) => {
    const config = req.body;

    console.log('Recebida requisição para ATUALIZAR config da loja.');

    try {
        const connection = await pool.getConnection();
        await connection.execute(
            `UPDATE store_config SET 
             nomeLoja=?, whatsappLink=?, whatsappNumero=?, enderecoTexto=?, mapaLink=?, 
             social_facebook=?, social_instagram=?, social_twitter=?, 
             sobreTitulo=?, sobreTexto=?, rodapeQuemSomos=?, 
             horario_dom=?, horario_seg=?, horario_ter=?, horario_qua=?, 
             horario_qui=?, horario_sex=?, horario_sab=?
             WHERE id = 1`,
            [
                config.nomeLoja, config.whatsappLink, config.whatsappNumero, config.enderecoTexto, config.mapaLink,
                config.social.facebook, config.social.instagram, config.social.twitter,
                config.sobreTitulo, config.sobreTexto, config.rodapeQuemSomos,
                config.horarios.dom, config.horarios.seg, config.horarios.ter, config.horarios.qua,
                config.horarios.qui, config.horarios.sex, config.horarios.sab
            ]
        );
        connection.release();

        console.log('Configuração da loja atualizada com sucesso.');
        res.json({ success: true, message: 'Configurações salvas com sucesso!' });

    } catch (error) {
        console.error('Erro ao salvar config da loja:', error);
        res.status(500).json({ error: 'Erro ao salvar configurações.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios.' });
    }
    try {
        const connection = await pool.getConnection();

const [rows] = await connection.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
);
        connection.release();

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (isMatch) {
            req.session.user = { 
                id: user.id, 
                username: user.username, 
                role: user.role
            };
            console.log(`Usuário "${user.username}" (Cargo: ${user.role}) logado com sucesso.`);
            return res.json({ success: true, role: user.role });
        } else {
            console.log(`Tentativa de login falhou para usuário "${username}".`);
            return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
        }
    } catch (error) {
        console.error('Erro no processo de login:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

app.get('/api/check-session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/api/products', async (req, res) => {
    console.log('Recebida requisição para /api/products');
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM products');
        connection.release();
        console.log(`Enviando ${rows.length} produtos.`);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
});

app.post('/api/orders', async (req, res) => {
    const { items, deliveryType, discount, finalPrice } = req.body; 
    if (!items || !deliveryType || finalPrice == null) {
        return res.status(400).json({ error: 'Dados do pedido incompletos.' });
    }
    let connection; 
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        console.log('--- NOVO PEDIDO RECEBIDO ---');
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (delivery_type, discount, final_price) VALUES (?, ?, ?)',
            [deliveryType, discount, finalPrice]
        );
        const newOrderId = orderResult.insertId;
        const orderItemsData = items.map(item => [newOrderId, item.id, item.qtd, item.price]);
        await connection.query(
            'INSERT INTO order_items (order_id, product_id, quantity, item_price) VALUES ?',
            [orderItemsData]
        );
        await connection.commit();
        console.log(`Pedido ${newOrderId} salvo com sucesso!`);
        res.json({ success: true, message: 'Pedido salvo com sucesso!' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao salvar pedido:', error);
        res.status(500).json({ error: 'Erro ao salvar o pedido.' });
    } finally {
        if (connection) connection.release();
    }
});

app.post('/api/logout', isLoggedIn, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).json({ success: false, message: 'Erro ao sair.' });
        }

        res.clearCookie('connect.sid');
        console.log('Usuário deslogado com sucesso.');
        res.json({ success: true, message: 'Logout bem-sucedido.' });
    });
});

app.get('/api/orders', isLoggedIn, async (req, res) => {
    console.log('Recebida requisição para /api/orders (logado)');
    try {
        const connection = await pool.getConnection();
const [rows] = await connection.execute(
    `SELECT * FROM orders 
     WHERE order_status = 'Pendente' OR order_status = 'Em Preparo' 
     ORDER BY id DESC`
);
        connection.release();
        console.log(`Enviando ${rows.length} pedidos.`);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
});

app.post('/api/orders/:id/complete', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    console.log(`Recebida requisição para CONCLUIR pedido ID: ${id} (logado)`);
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE orders SET order_status = ? WHERE id = ?',
            ['Concluído', id]
        );
        connection.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }
        console.log(`Pedido ID ${id} marcado como "Concluído".`);
        res.json({ success: true, message: 'Pedido atualizado!' });
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        res.status(500).json({ error: 'Erro ao atualizar pedido.' });
    }
});

app.get('/api/reports/daily', isStoreAdmin, async (req, res) => {
    console.log(`Recebida requisição para Relatório do Dia (logado)`);
    try {
        const connection = await pool.getConnection();

        const [stats] = await connection.execute(
            `SELECT 
                COUNT(id) as totalOrders, 
                SUM(final_price) as totalRevenue 
             FROM orders 
             WHERE order_status = 'Concluído' AND DATE(created_at) = CURDATE()`
        );
        
        connection.release();

        const report = stats[0];

        let avgTicket = 0;
        if (report.totalOrders > 0) {
            avgTicket = report.totalRevenue / report.totalOrders;
        }

        console.log(`Relatório do Dia: ${report.totalOrders} pedidos, R$ ${report.totalRevenue} faturados.`);
        
        res.json({
            success: true,
            totalOrders: report.totalOrders || 0,
            totalRevenue: report.totalRevenue || 0,
            avgTicket: avgTicket
        });

    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({ error: 'Erro ao gerar relatório.' });
    }
});

app.post('/api/orders/:id/accept', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    console.log(`Recebida requisição para ACEITAR pedido ID: ${id} (logado)`);
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE orders SET order_status = ? WHERE id = ?',
            ['Em Preparo', id] 
        );
        connection.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }
        console.log(`Pedido ID ${id} marcado como "Em Preparo".`);
        res.json({ success: true, message: 'Pedido aceito!' });
    } catch (error) {
        console.error('Erro ao aceitar pedido:', error);
        res.status(500).json({ error: 'Erro ao aceitar pedido.' });
    }
});

app.post('/api/orders/:id/cancel', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    console.log(`Recebida requisição para CANCELAR pedido ID: ${id} (logado)`);
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE orders SET order_status = ? WHERE id = ?',
            ['Cancelado', id]
        );
        connection.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }
        console.log(`Pedido ID ${id} marcado como "Cancelado".`);
        res.json({ success: true, message: 'Pedido cancelado!' });
    } catch (error) {
        console.error('Erro ao cancelar pedido:', error);
        res.status(500).json({ error: 'Erro ao cancelar pedido.' });
    }
});

app.get('/api/orders/:id/items', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    console.log(`Recebida requisição para ITENS do pedido ID: ${id} (logado)`);
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `SELECT oi.quantity, oi.item_price, p.name 
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [id]
        );
        connection.release();
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Itens não encontrados.' });
        }
        console.log(`Enviando ${rows.length} itens do pedido ${id}.`);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        res.status(500).json({ error: 'Erro ao buscar itens.' });
    }
});

app.post('/api/orders/:id/accept', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    console.log(`Recebida requisição para ACEITAR pedido ID: ${id} (logado)`);
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE orders SET order_status = ? WHERE id = ?',
            ['Em Preparo', id]
        );
        connection.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }
        console.log(`Pedido ID ${id} marcado como "Em Preparo".`);
        res.json({ success: true, message: 'Pedido aceito!' });
    } catch (error) {
        console.error('Erro ao aceitar pedido:', error);
        res.status(500).json({ error: 'Erro ao aceitar pedido.' });
    }
});

app.post('/api/orders/:id/cancel', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    console.log(`Recebida requisição para CANCELAR pedido ID: ${id} (logado)`);
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE orders SET order_status = ? WHERE id = ?',
            ['Cancelado', id]
        );
        connection.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }
        console.log(`Pedido ID ${id} marcado como "Cancelado".`);
        res.json({ success: true, message: 'Pedido cancelado!' });
    } catch (error) {
        console.error('Erro ao cancelar pedido:', error);
        res.status(500).json({ error: 'Erro ao cancelar pedido.' });
    }
});

app.get('/api/orders/:id/items', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    console.log(`Recebida requisição para ITENS do pedido ID: ${id} (logado)`);
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `SELECT oi.quantity, oi.item_price, p.name 
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [id]
        );
        connection.release();
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Itens não encontrados.' });
        }
        console.log(`Enviando ${rows.length} itens do pedido ${id}.`);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        res.status(500).json({ error: 'Erro ao buscar itens.' });
    }
});

app.post('/api/admin/register', isSuperAdmin, async (req, res) => {
    const { username, password } = req.body;
    const saltRounds = 10; 

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }
    console.log(`Recebida requisição para CADASTRAR novo admin: ${username}`);
    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
            [username, passwordHash, 'store']
        );
        connection.release();

        console.log(`Novo usuário admin "${username}" (ID: ${result.insertId}) criado com sucesso.`);
        res.status(201).json({ success: true, message: 'Novo administrador cadastrado com sucesso!' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Erro: Usuário já existe.');
            return res.status(409).json({ error: 'Este nome de usuário já está em uso.' });
        }
        console.error('Erro ao cadastrar novo admin:', error);
        res.status(500).json({ error: 'Erro interno ao cadastrar administrador.' });
    }
});

app.post('/api/products', isStoreAdmin, upload.single('productImage'), async (req, res) => {
    const { id, type, name, description, price, lastPrice } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: 'A imagem do produto é obrigatória.' });
    }
    const img = req.file.filename; 

    if (!id || !type || !name || !price) {
        return res.status(400).json({ error: 'Dados incompletos para cadastrar produto.' });
    }
    console.log(`Recebida requisição para CRIAR produto: ${name} com imagem ${img}`);
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO products (id, type, name, description, price, lastPrice, img) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, type, name, description, price || 0, lastPrice || 0, img]
        );
        connection.release();
        console.log(`Produto ${name} (ID: ${id}) criado com sucesso.`);
        res.status(201).json({ success: true, message: 'Produto criado com sucesso!', insertedId: result.insertId });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro ao criar produto.' });
    }
});

app.put('/api/products/:id', isStoreAdmin, upload.single('productImage'), async (req, res) => {
    const { id } = req.params; 
    const { type, name, description, price, lastPrice, currentImg } = req.body;
    let img;
    if (req.file) {
        img = req.file.filename; 
    } else {
        img = currentImg; 
    }
    if (!type || !name || !price || !img) {
        return res.status(400).json({ error: 'Dados incompletos para atualizar produto.' });
    }
    console.log(`Recebida requisição para ATUALIZAR produto ID: ${id}`);
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE products SET type = ?, name = ?, description = ?, price = ?, lastPrice = ?, img = ? WHERE id = ?',
            [type, name, description, price, lastPrice || 0, img, id]
        );
        connection.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        console.log(`Produto ID ${id} atualizado com sucesso.`);
        res.json({ success: true, message: 'Produto atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
});

app.delete('/api/products/:id', isStoreAdmin, async (req, res) => {
    const { id } = req.params; 
    console.log(`Recebida requisição para EXCLUIR produto ID: ${id}`);
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'DELETE FROM products WHERE id = ?',
            [id]
        );
        connection.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        console.log(`Produto ID ${id} excluído com sucesso.`);
        res.json({ success: true, message: 'Produto excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro ao excluir produto.' });
    }
});


//INICIAR O SERVIDOR
app.listen(port, () => {
    console.log(`Back-end rodando em http://localhost:${port}`);
    console.log('Conectado ao MySQL "cardapio_online".');
});