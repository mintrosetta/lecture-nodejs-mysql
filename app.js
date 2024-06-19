const express = require("express");
const mysql = require("mysql2");

const app = express();

// mysql connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'mysql_nodejs'
});

app.use(express.json()) // change json to js object

connection.connect((err) => {
    if (err) {
        console.log('Error connectiong to MySQL \n' + err.message);
        return;
    }

    console.log('MySQL connect successful');
});

// create route
app.post("/create", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const query = "INSERT INTO users(email, full_name, password) VALUES (?, ?, ?)";
        connection.query(query, [email, name, password], (err, result, fields) =>  {
            if (err)  {
                console.log(err.message);
                return res.status(400).send();
            }

            return res.status(201).json({
                message: "new user succesful"
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

// read route
app.get("/read", async (req, res) => {
    try {
        const query = "SELECt * FROM users";
        connection.query(query, [], (err, result, fields) =>  {
            if (err)  {
                console.log(err.message);
                return res.status(400).send();
            }

            return res.status(200).json({
                message: "successful",
                datas: result
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.get("/read/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const query = "SELECt * FROM users WHERE email = ?";
        connection.query(query, [email], (err, result, fields) =>  {
            if (err)  {
                console.log(err.message);
                return res.status(400).send();
            }

            return res.status(200).json({
                message: "successful",
                datas: result
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

// update data
app.patch("/update/:email", async (req, res) => {
    const email = req.params.email;
    const newPassword = req.body.newPassword;

    try {
        const query = "UPDATE users SET password = ? WHERE email = ?";
        connection.query(query, [newPassword, email], (err, result, fields) =>  {
            if (err)  {
                console.log(err.message);
                return res.status(400).send();
            }

            return res.status(200).json({
                message: "successful",
                datas: result
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.delete("/delele/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const query = "DELETE FROM users WHERE email = ?";
        connection.query(query, [email], (err, result, fields) =>  {
            if (err)  {
                console.log(err.message);
                return res.status(400).send();
            }

            if (result.affectedRows === 0) {
                return res.json(404).json({
                    message: "No user with that email"
                });
            }

            return res.status(200).json({
                message: "successful",
                datas: null
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.listen(3000, () => {
    console.log("Server listening at http://localhost:3000");
});