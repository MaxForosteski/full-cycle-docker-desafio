const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

const config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

async function ensureTableExists(conn) {
    await conn.execute(`
        CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `);
}

app.get('/', async (req, res) => {
    try{
        const conn = await mysql.createConnection(config);
        await ensureTableExists(conn);

        const name = "Max";
        await conn.execute(`INSERT INTO people(name) VALUES (?)`, [name]);

        const [rows] = await conn.execute(`SELECT * FROM people`);
        let html = '<h1>Full cycle Rocks!</h1>';
        html += '<ul>';
        rows.forEach(row => {
            html += `<li>${row.name}</li>`;
        });
        html+= '</ul>';

        await conn.end();
        res.send(html);
    } catch (err) {
        console.error('Erro na aplicação:', err);
        res.status(500).send('Erro interno do servidor');
    }
});

app.listen(port, () => {
    console.log(`aplicação rodando na porta ${port}`);
})
