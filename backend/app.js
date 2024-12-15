const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/connection');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies and credentials
  }));

app.get('/', (req, res) => {
    res.send('Backas veikia...');
});


app.post('/users', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Default foreign key values (adjust as necessary)
      const defaultDesignId = 1; // Ensure a default design exists in the `Designs` table
      const defaultRankId = 1;   // Ensure a default rank exists in the `Ranks` table
      const currentDate = new Date().toISOString().split('T')[0];
  
      // Insert user into the database
      const [result] = await db.query(
        `INSERT INTO Users (username, password, name, surname, city, exp, role, registration_date, fk_Design, fk_Rank)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, hashedPassword, 'Default Name', 'Default Surname', 'Default City', 0, 'user', currentDate, defaultDesignId, defaultRankId]
      );
  
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error("Error registering user:", error);  // Log the actual error
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  });

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Portas: ${PORT}`);
});
