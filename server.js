const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const db = new sqlite3.Database('users.db');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/api/lawyer-login', express.json(), (req, res) => {
    const { lawyerId, lawyerPassword } = req.body;
  
    const query = `SELECT * FROM lawyers WHERE lawyer_id = ? AND password = ?`;
    db.get(query, [lawyerId, lawyerPassword], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal server error');
      }
  
      if (row) {
        res.json({ success: true });

      } else {
        res.status(401).json({ success: false, message: "Invalid ID or password" });

      }
    });
  });
  




app.post('/login', (req, res) => {
    const { role, name, userId, password } = req.body;

    if (!role || !name || !userId || !password) {
        return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    let table, idField;

    if (role === 'lawyer') {
        table = 'lawyers';
        idField = 'lawyer_id';
    } else if (role === 'victim') {
        table = 'victims';
        idField = 'victim_id';
    } else {
        return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const query = `SELECT * FROM ${table} WHERE name = ? AND ${idField} = ? AND password = ?`;

    db.get(query, [name, userId, password], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (row) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});
  
app.post('/signup', (req, res) => {
    const { role, name, userId, password } = req.body;

    if (!role || !name || !userId || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let table, column;
    if (role === 'lawyer') {
        table = 'lawyers';
        column = 'lawyer_id';
    } else if (role === 'victim') {
        table = 'victims';
        column = 'victim_id';
    } else {
        return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    const checkQuery = `SELECT * FROM ${table} WHERE ${column} = ?`;
    db.get(checkQuery, [userId], (err, existingUser) => {
        if (err) {
            console.error("Error checking user:", err.message);
            return res.status(500).json({ success: false, message: "Internal server error during lookup" });
        }

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const insertQuery = `INSERT INTO ${table} (name, ${column}, password) VALUES (?, ?, ?)`;
        db.run(insertQuery, [name, userId, password], function (err) {
            if (err) {
                console.error("Error inserting user:", err.message);
                return res.status(500).json({ success: false, message: "Internal server error during insert" });
            }

            return res.json({ success: true, message: "Signup successful" });
        });
    });
});




app.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
});
