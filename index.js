
const mysql = require("mysql2/promise");
const express = require("express");
const app = express();
const pool = mysql.createPool({
    host: "http://localhost/3306",
    user: "your_username",
    password: "your_password",
    database: "your_database",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
app.use(express.json());
const Resort = {
    getAll:
        async (req, res) => {
            try {
                const connection = await pool.getConnection();
                const [rows] = await connection.query("SELECT * FROM resort");
                connection.release();
                res.json(rows);
            } catch (error) {
                res.status(500).json({
                    error: `Failed to get resort: ${error}`
                });
            }
        },
    getById:
        async (req, res) => {
            const { id } = req.params;
            try {
                const connection = await pool.getConnection();
                const [rows] = await connection.query("SELECT * FROM resort WHERE id = ?", [id]);
                connection.release();
                if (rows.length === 0) {
                    res.status(404).json({ error: "Resort not found" });
                } else {
                    res.json(rows[0]);
                }
            }
            catch (error) {
                res.status(500).json({ error: `Failed to get resort with ID ${id}: ${error}` });
            }
        },
    create:
        async (req, res) => {
            const { name, location, price, description, imageUrl } = req.body;
            try {
                const connection = await pool.getConnection();
                const [result] =
                    await connection.query
                        ("INSERT INTO resort (name, location, price, description, imageUrl) VALUES (?, ?, ?, ?, ?)",
                            [name, location, price, description, imageUrl]);
                connection.release();
                res.status(201).json
                    ({ id: result.insertId });
            } catch (error) {
                res.status(500).json
                    ({ error: `Failed to create resort: ${error}` });
            }
        },
    update:
        async (req, res) => {
            const { id } = req.params;
            const { name, location, price, description, imageUrl } = req.body;
            try {
                const connection = await pool.getConnection();
                const [result] = await connection.query
                    ("UPDATE resort SET name = ?, location = ?,price = ?,description = ?,imageUrl = ?WHERE id = ? ",
                        [name, location, price, description, imageUrl, id]);
                connection.release();
                if (result.affectedRows > 0) {
                    res.json({ success: true });
                }
                else {
                    res.status(404).json({ error: "Resort not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: `Failed to update resort with ID ${id}: ${error}` });
            }
        }, delete: async (req, res) => {
            const { id } = req.params;
            try {
                const connection = await pool.getConnection();
                const [result] = await connection.query("DELETE FROM resort WHERE id = ? ",
                    [id]); connection.release();
                if (result.affectedRows > 0) {
                    res.json({ success: true });
                } else {
                    res.status(404).json({ error: "Resort not found" });
                }
            }
            catch (error) {
                res.status(500).json
                ({ error: `Failed to delete resort with ID ${id}: ${error}` });
            }
        },
};
// Define routes 
app.get("/Resort", Resort.getAll);
app.get("/resort/:id", Resort.getById);
app.post("/resort", Resort.create);
app.put("/resort/:id", Resort.update);
app.delete("/resort/:id", Resort.delete);
// Start the server 
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
