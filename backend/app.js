const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const cron = require('node-cron');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser middleware
app.use(cors({
  origin: "http://localhost:5173",  // Make sure this matches the frontend URL
  credentials: true,  // Allow credentials (cookies)
}));

// --------------------------------------------------------------------------
app.get("/achievements", async (req, res) => {
  const query = 'SELECT * FROM achievements'; // Query to get all achievements
  
  try {
    const [results] = await db.query(query);  // Use await to execute the query
    res.json(results); // Send the achievements as JSON response
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error getting achievements');
  }
});
app.post('/achievements', async (req, res) => {
  const { fish_weight, prize, date, fish_count, post_count, fk_Post } = req.body;

  if (!fish_weight || !prize || !date || !fish_count || !post_count || !fk_Post) {
    return res.status(400).json({ message: 'All fields must be filled!' });
  }

  const insertQuery = `
    INSERT INTO achievements (fish_weight, prize, date, fish_count, post_count, fk_Post) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [results] = await db.query(insertQuery, [fish_weight, prize, date, fish_count, post_count, fk_Post]);
    res.status(201).json({ id: results.insertId, ...req.body });
  } catch (err) {
    console.error('Error inserting achievement:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/achievements/:id', async (req, res) => {
  const { id } = req.params;
  const { fish_weight, prize, date, fish_count, post_count, fk_Post } = req.body;

  if (!fish_weight || !prize || !date || !fish_count || !post_count || !fk_Post) {
    return res.status(400).json({ message: 'All fields must be filled!' });
  }

  const updateQuery = `
    UPDATE achievements 
    SET fish_weight = ?, prize = ?, date = ?, fish_count = ?, post_count = ?, fk_Post = ? 
    WHERE id_Achievement = ?
  `;

  try {
    const [results] = await db.query(updateQuery, [fish_weight, prize, date, fish_count, post_count, fk_Post, id]);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    
    res.json({ message: 'Achievement updated', id, ...req.body });
  } catch (err) {
    console.error('Error updating achievement:', err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/ranks", async (req, res) => {
  try {
    const query = "SELECT id_Rank, name, exp FROM ranks";
    const [results] = await db.query(query); // Use async/await
    res.json(results); // Send the query results as JSON
  } catch (err) {
    console.error("Error fetching ranks:", err);
    res.status(500).send("Error fetching ranks.");
  }
});


app.delete('/achievements/:id', (req, res) => {
  const { id } = req.params;

  // Make sure id is valid
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID provided' });
  }

  // Delete the lake from the database
  const query = 'DELETE FROM achievements WHERE id_Achievement = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting achievement:', err);
      return res.status(500).json({ error: 'Error deleting achievement', details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'achievement not found' });
    }

    res.status(200).json({ message: 'achievement deleted successfully' });
  });
});

// 4 example ranks with their experience thresholds
const ranks = [
  { name: 'Beginner', expThreshold: 0 },
  { name: 'Intermediate', expThreshold: 100 },
  { name: 'Pro', expThreshold: 500 },
  { name: 'Expert', expThreshold: 1000 },
  { name: 'Master Angler', expThreshold: 2000 },
];

// Achievements based on post count, fish count, and fish weight
const achievements = [
  { name: 'Post Master', condition: (postCount) => postCount >= 5, action: 'Created 5 posts' },
  { name: 'Fisherman', condition: (fishCount) => fishCount >= 10, action: 'Caught 10 fishes' },
  { name: 'Big Catch', condition: (fishWeight) => fishWeight > 5, action: 'Caught a fish over 5kg' },
];

async function checkAndUpdateAchievements(userId, postCount, fishCount, fishWeight) {
  try {
    const achieved = [];

    // Get all achievements from the database
    const query = `SELECT * FROM Achievements`;
    const [achievements] = await db.query(query);

    // Loop through achievements and check conditions
    for (let achievement of achievements) {
      let conditionMet = false;

      // Check if the user meets the conditions for the achievement
      if (achievement.post_count && postCount >= achievement.post_count) {
        conditionMet = true;
      } else if (achievement.fish_count && fishCount >= achievement.fish_count) {
        conditionMet = true;
      } else if (achievement.fish_weight && fishWeight >= achievement.fish_weight) {
        conditionMet = true;
      }

      // If the condition is met and the user hasn't unlocked the achievement yet
      if (conditionMet) {
        const checkIfUnlockedQuery = `SELECT * FROM users_achievement WHERE fk_User = ? AND fk_Achievement = ?`;
        const [existingAchievement] = await db.query(checkIfUnlockedQuery, [userId, achievement.id_Achievement]);

        if (existingAchievement.length === 0) {
          // Insert a new record to indicate the user unlocked this achievement
          const insertQuery = `INSERT INTO users_achievement (fk_User, fk_Achievement) VALUES (?, ?)`;
          await db.query(insertQuery, [userId, achievement.id_Achievement]);
          achieved.push(achievement.prize); // Track the unlocked achievement
        }
      }
    }

    if (achieved.length > 0) {
      console.log(`User ${userId} unlocked achievements: ${achieved.join(', ')}`);
    }
  } catch (error) {
    console.error("Error checking or updating achievements:", error);
  }
}

// Funkcija, kad ištrintume susijusius įrašus ir pasiekimą
const deleteAchievement = async (req, res) => {
  const achievementId = req.params.id; // Pasiekimo ID

  try {
    // Pirmiausia ištrinkite susijusius įrašus iš `users_achievement` lentelės
    await db.promise().query('DELETE FROM users_achievement WHERE fk_Achievement = ?', [achievementId]);

    // Dabar ištrinkite pačią pasiekimo eilutę iš `achievements` lentelės
    const [result] = await db.promise().query('DELETE FROM achievements WHERE id_Achievement = ?', [achievementId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.status(200).json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return res.status(500).json({ error: 'Error deleting achievement' });
  }
};

// Express maršruto nustatymas
app.delete('/achievement/:id', deleteAchievement);

// Function to check and update rank for a single user
async function checkAndUpdateRanks(userId, userExp) {
  try {
    const query = `
      SELECT id_Rank FROM Ranks WHERE exp <= ? ORDER BY exp DESC LIMIT 1
    `;
    const [result] = await db.query(query, [userExp]);

    if (result && result.length > 0) {
      const newRankId = result[0].id_Rank;

      // Check if the rank needs to be updated
      const currentRankQuery = `
        SELECT fk_Rank FROM Users WHERE User_ID = ?
      `;
      const [currentRankResult] = await db.query(currentRankQuery, [userId]);

      if (currentRankResult[0].fk_Rank !== newRankId) {
        const updateQuery = `
          UPDATE Users SET fk_Rank = ? WHERE User_ID = ?
        `;
        await db.query(updateQuery, [newRankId, userId]);
        console.log(`User ${userId} promoted to rank ${newRankId}`);
      }
    }
  } catch (error) {
    console.error("Error checking or updating rank:", error);
  }
}

// Schedule the task to run every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
  console.log('Refreshing ranks and achievements for all users...');

  
  
  try {
    // Get all users and their experience, posts, fish count, and weight
    const query = `
      SELECT User_ID, exp, 
             (SELECT COUNT(*) FROM Posts WHERE fk_User = Users.User_ID) AS post_count, 
             (SELECT COUNT(*) FROM Fish WHERE fk_Post IN (SELECT id_Post FROM Posts WHERE fk_User = Users.User_ID)) AS fish_count,
             (SELECT SUM(CAST(weight AS DOUBLE)) FROM Fish WHERE fk_Post IN (SELECT id_Post FROM Posts WHERE fk_User = Users.User_ID)) AS fish_weight
      FROM Users;
    `;
    const [users] = await db.query(query);

    // Loop through each user and check if their rank and achievements need to be updated
    for (const user of users) {
      await checkAndUpdateRanks(user.User_ID, user.exp);
      await checkAndUpdateAchievements(user.User_ID, user.post_count, user.fish_count, user.fish_weight);
    }

    console.log('Ranks and achievements for all users have been updated.');
  } catch (error) {
    console.error('Error refreshing ranks and achievements:', error);
  }
});

app.get('/user-achievements', async (req, res) => {
  try {
    // SQL query to get usernames and achievement names
    const query = `
      SELECT users.username, GROUP_CONCAT(Achievements.prize) AS achievements
      FROM users_achievement
      JOIN Users ON users_achievement.fk_User = Users.User_ID
      JOIN Achievements ON users_achievement.fk_Achievement = Achievements.id_Achievement
      GROUP BY Users.username;
    `;
    
    const [results] = await db.query(query);
    
    // Send the results to the frontend
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    res.status(500).json({ message: 'Error fetching user achievements', error: error.message });
  }
});

app.post('/posts', async (req, res) => {
  const { userId, postData } = req.body;

  try {
    // Insert new post
    const insertPostQuery = `
      INSERT INTO Posts (date, time, comment, picture, fk_User)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [postResult] = await db.query(insertPostQuery, [postData.date, postData.time, postData.comment, postData.picture, userId]);

    // Get user data
    const userQuery = `
      SELECT exp, 
             (SELECT COUNT(*) FROM Posts WHERE fk_User = ?) AS post_count, 
             (SELECT COUNT(*) FROM Fish WHERE fk_Post IN (SELECT id_Post FROM Posts WHERE fk_User = ?)) AS fish_count,
             (SELECT SUM(CAST(weight AS DOUBLE)) FROM Fish WHERE fk_Post IN (SELECT id_Post FROM Posts WHERE fk_User = ?)) AS fish_weight
      FROM Users WHERE User_ID = ?
    `;
    const [userData] = await db.query(userQuery, [userId, userId, userId, userId]);

    // Check and update rank/achievement based on data
    const { exp, post_count, fish_count, fish_weight } = userData[0];
    await checkAndUpdateRanks(userId, exp);
    await checkAndUpdateAchievements(userId, post_count, fish_count, fish_weight);

    res.status(201).json({ message: 'Post added, rank and achievements checked.' });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ message: 'Error adding post', error: error.message });
  }
});

app.get('/achievements', (req, res) => {
  try {
    res.status(200).json(achievements);  // Send the predefined achievements list
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ message: 'Error fetching achievements', error: error.message });
  }
});

app.get('/api/lakes', async (req, res) => {
  try {
    // Query to fetch all lakes from the database
    const [rows, fields] = await db.query('SELECT * FROM lakes');
    res.json(rows);  // Send the rows (lake data) as a JSON response
  } catch (err) {
    console.error('Database query failed:', err.message);  // Log the error message
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

// POST - Add a new lake
app.post('/api/lakes', (req, res) => {
  const {
    name,
    type,
    depth,
    width,
    length,
    shores,
    district,
    x,
    y,
    recreation_area,
    fk__Map_settings
  } = req.body;

  // Ensure all required fields are provided and valid
  if (!name || !type || depth <= 0 || width <= 0 || length <= 0 || shores <= 0 || !district || x == null || y == null || recreation_area == null || fk__Map_settings < 0 ) {
    return res.status(400).json({ error: 'Missing or invalid data' });
  }

  // Insert the new lake into the database
  const query = `
    INSERT INTO lakes (name, type, depth, width, length, shores, district, x, y, recreation_area, fk__Map_settings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [name, type, depth, width, length, shores, district, x, y, recreation_area, fk__Map_settings], (err, result) => {
    if (err) {
      console.error('Error inserting lake:', err);
      return res.status(500).json({ error: 'Error inserting lake', details: err.message });
    }

    // Respond with the created lake, including its generated ID
    res.status(201).json({
      id_Lake: result.insertId,
      name,
      type,
      depth,
      width,
      length,
      shores,
      district,
      x,
      y,
      recreation_area,
      fk__Map_settings
    });
  });
});
app.put('/lakes/:id', async (req, res) => {
  const { id } = req.params;
  const { fish_weight, prize, date, fish_count, post_count, fk_Post } = req.body;

  if (!name || !type || depth <= 0 || width <= 0 || length <= 0 || shores <= 0 || !district || x == null || y == null || recreation_area == null || fk__Map_settings < 0 ) {
    return res.status(400).json({ error: 'Missing or invalid data' });
  }

  const query = `
    UPDATE lakes
    SET name = ?, type = ?, depth = ?, width = ?, length = ?, shores = ?, district = ?, x = ?, y = ?, recreation_area = ?, fk__Map_settings = ?
    WHERE id_Lake = ?
  `;

  try {
    const [results] = await db.query(updateQuery, [name, type, depth, width, length, shores, district, x, y, recreation_area, fk__Map_settings, id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json({ message: 'Achievement updated', id, ...req.body });
  } catch (err) {
    console.error('Error updating achievement:', err);
    res.status(500).json({ error: err.message });
  }
});


// DELETE - Remove a lake
app.delete('/api/lakes/:id', (req, res) => {
  const { id } = req.params;

  // Delete the lake from the database
  const query = 'DELETE FROM lakes WHERE id_Lake = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting lake:', err);
      return res.status(500).json({ error: 'Error deleting lake', details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lake not found' });
    }

    res.status(200).json({ message: 'Lake deleted successfully' });
  });
});

// Update a fish
app.put("/fishes/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, size, weight, age, diet, edible, picture } = req.body;
  
  try {
    const query = `
      UPDATE fish
      SET name = ?, type = ?, size = ?, weight = ?, age = ?, diet = ?, edible = ?, picture = ?
      WHERE id_Fish = ?;
    `;
    const values = [name, type, size, weight, age, diet, edible ? 1 : 0, picture || null, id];
    const [result] = await db.query(query);
  
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Fish not found" });
    }
  
    res.status(200).json({ message: "Fish updated successfully" });
  } catch (error) {
    console.error("Error updating fish:", error);
    res.status(500).json({ message: "Failed to update fish" });
  }
  });
  
  // Delete a fish
  app.delete("/fishes/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = "DELETE FROM fish WHERE id_Fish = ?;";
    const result = await db.query(query, [id]);
  
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Fish not found" });
    }
  
    res.status(200).json({ message: "Fish deleted successfully" });
  } catch (error) {
    console.error("Error deleting fish:", error);
    res.status(500).json({ message: "Failed to delete fish" });
  }
  });
  
  // Route to save fish data to the database
  app.post('/fishes/wikipedia', async (req, res) => {
  const fishes = req.body;
  
  // Validate that fishes data is provided
  if (!Array.isArray(fishes) || fishes.length === 0) {
    return res.status(400).json({ message: 'No fish data provided' });
  }
  
  // Prepare values for insertion
  const values = fishes.map(fish => [
    fish.id,
    fish.name,
    fish.type,
    fish.size,
    fish.picture || null,
  ]);
  
  // Validate that values array is not empty
  if (values.length === 0) {
    return res.status(400).json({ message: 'Fish data is invalid' });
  }
  
  try {
    const query = `
      INSERT INTO fish (id_Fish, name, type, size, picture)
      VALUES ?;
    `;
    await db.query(query, [values]);
    res.status(200).json({ message: 'Žuvis sėkmingai pridėta!' });
  } catch (error) {
    console.error('Duomenų bazės klaida:', error.message);
    res.status(500).json({ message: `Duomenų bazės klaida: ${error.message}` });
  }
  });
  // Route to get all fishes
  app.get('/fishes', async (req, res) => {
    try {
      const query = `
        SELECT f.id_Fish AS id, f.name, f.type, f.size, f.weight, f.age, f.diet, f.picture, l.name AS lake_name
        FROM fish f
        LEFT JOIN lake_fish lf ON f.id_Fish = lf.fk_Fish
        LEFT JOIN lakes l ON lf.fk_Lakes = l.id_Lake;
      `;
  
      // Execute the query
      const [rows] = await db.query(query);
  
      // Check if there are any rows returned
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No fishes found in the database' });
      }
  
      res.status(200).json(rows);
    } catch (error) {
      // Log the error and return a more descriptive message
      console.error("Error fetching fishes:", error);
      res.status(500).json({ message: "Failed to fetch fishes from the database", error: error.message });
    }
  });
  
  // Add a new fish
  app.post("/fishes", async (req, res) => {
    const { name, type, size, weight, age, diet, edible, lakeId, picture } = req.body;
  
    // Validate required fields
    if (!name || !type || size <= 0 || typeof edible !== "boolean") {
      return res.status(400).json({ message: "Invalid input: Ensure 'name', 'type', 'size' > 0, and 'edible' is a boolean" });
    }
  
    try {
      // Insert fish into the fish table
      const query = `
        INSERT INTO fish (name, type, size, weight, age, diet, edible, fk_Post, picture)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      const values = [
        name, 
        type, 
        size, 
        weight || null, 
        age || null, 
        diet || null, 
        edible ? 1 : 0, 
        null, 
        picture || null
      ];
  
      const [result] = await db.query(query, values);
  
      // If a lake ID is provided, link the fish to the lake
      if (lakeId) {
        const lakeFishQuery = "INSERT INTO lake_fish (fk_Fish, fk_Lakes) VALUES (?, ?)";
        await db.query(lakeFishQuery, [result.insertId, lakeId]);
      }
  
      res.status(201).json({ message: "Fish added successfully", id: result.insertId });
    } catch (error) {
      console.error("Error adding fish:", error);
      res.status(500).json({ message: "Failed to add fish", error: error.message });
    }
  });
  
  
  
  // Update a fish
  app.put("/fishes/:id", async (req, res) => {
    console.log("Request body:", req.body);
    const { id } = req.params;
    const { name, type, size, weight, age, diet, edible, picture } = req.body;
  
    // Log the incoming request
    console.log("Updating fish with ID:", id);
    console.log("Request body:", req.body); 
  
    // Validate input
    if (!name || !type || !size || size <= 0 || typeof edible !== "boolean") {
      return res.status(400).json({
        message: "Invalid input: Ensure 'name', 'type', 'size' > 0, and 'edible' is a boolean"
      });
    }
  
    // Convert 'size' to a number (if it is a string)
    const numericSize = parseFloat(size);
    if (isNaN(numericSize) || numericSize <= 0) {
      return res.status(400).json({ message: "Invalid size" });
    }
  
    // Ensure diet is a valid string or null (if 'diet' is coming through as a number, handle it)
    const validDiet = diet && typeof diet === 'string' ? diet : null;
  
    // Handle optional fields: weight and age could be null
    const numericWeight = weight !== undefined ? (weight === null ? null : parseFloat(weight)) : null;
    const numericAge = age !== undefined ? (age === null ? null : parseInt(age)) : null;
  
    try {
      // Check if the fish exists in the database
      const checkFishQuery = "SELECT * FROM fish WHERE id_Fish = ?";
      const [fish] = await db.query(checkFishQuery, [id]);
  
      if (fish.length === 0) {
        return res.status(404).json({ message: "Fish not found" });
      }
  
      // Create the update query
      const updateQuery = `
        UPDATE fish
        SET name = ?, type = ?, size = ?, weight = ?, age = ?, diet = ?, edible = ?, picture = ?
        WHERE id_Fish = ?
      `;
      
      const values = [
        name, 
        type, 
        numericSize, 
        numericWeight, 
        numericAge, 
        validDiet, 
        edible ? 1 : 0, 
        picture || null, 
        id
      ];
  
      console.log('Executing update query:', updateQuery); // Log query
      console.log('With values:', values); // Log values
  
      // Execute the update query
      const [result] = await db.query(updateQuery, values);
  
      console.log('Update Result:', result); // Log query result
  
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Fish updated successfully" });
      } else {
        return res.status(400).json({ message: "No changes made to the fish" });
      }
    } catch (error) {
      console.error("Error updating fish:", error);
      res.status(500).json({ message: "Failed to update fish", error: error.message });
    }
  });
  
  
  
  
  // Delete a fish
  app.delete("/fishes/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      // First, delete the references from lake_fish table
      const lakeFishQuery = "DELETE FROM lake_fish WHERE fk_Fish = ?";
      const lakeFishResult = await db.query(lakeFishQuery, [id]);
  
      // Now, delete the fish from the fish table
      const query = "DELETE FROM fish WHERE id_Fish = ?;";
      const result = await db.query(query, [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Fish not found" });
      }
  
      res.status(200).json({ message: "Fish deleted successfully" });
    } catch (error) {
      console.error("Error deleting fish:", error);
      res.status(500).json({ message: "Failed to delete fish" });
    }
  });
  
  
  // Route to save fish data to the database
  app.post('/fishes/wikipedia', async (req, res) => {
    const fishes = req.body;
  
    // Validate that fishes data is provided
    if (!Array.isArray(fishes) || fishes.length === 0) {
      return res.status(400).json({ message: 'No fish data provided' });
    }
  
    // Prepare values for insertion
    const values = fishes.map(fish => [
      fish.name,
      fish.type || "Unknown",
      fish.size || 0,
      fish.picture || null,
    ]);
  
    // Validate that values array is not empty
    if (values.length === 0) {
      return res.status(400).json({ message: 'Fish data is invalid' });
    }
  
    try {
      const query = `
        INSERT INTO fish (name, type, size, picture)
        VALUES ?;
      `;
      await db.query(query, [values]);
      res.status(200).json({ message: 'Žuvis sėkmingai pridėta!' });
    } catch (error) {
      console.error('Duomenų bazės klaida:', error.message);
      res.status(500).json({ message: `Duomenų bazės klaida: ${error.message}` });
    }
  });
// ----------------------------------------

app.get('/', (req, res) => {
    res.send('Backas veikia...');
});

app.get("/session", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, 'jwt-secret-key'); // Decode the token
    return res.status(200).json({ authenticated: true, user: decoded });
  } catch (error) {
    console.error("Token validation error:", error.message);
    return res.status(401).json({ authenticated: false });
  }
});


app.get('/userget', async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).send('Unauthorized: No token provided');
    }

    const decodedToken = jwt.verify(token, 'jwt-secret-key');
    const userId = decodedToken.id;


    const [results] = await db.query('SELECT username, city, surname, name FROM users WHERE User_ID = ?', [userId]);

    if (results.length === 0) {
      console.log("User not found");
      return res.status(404).send('User not found');
    }

    console.log("User Data:", results[0]);
    return res.json({ username: results[0].username, city: results[0].city, surname: results[0].surname, name: results[0].name });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send('Something went wrong');
  }
});



app.put('/userupdate', (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = jwt.verify(token, 'jwt-secret-key');
    const userId = decodedToken.id;
    const { username, city } = req.body;

    db.query(
      'UPDATE users SET username = ?, city = ? WHERE User_ID = ?',
      [username, city, userId],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ error: 'Error updating user data' });
        }
        return res.send({ message: 'Profile updated successfully' });
      }
    );
  } catch (err) {
    return res.status(403).send({ error: 'Invalid token' });
  }
});

app.delete('/userdelete', (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = jwt.verify(token, 'jwt-secret-key');
    const userId = decodedToken.id;

    db.query('DELETE FROM users WHERE User_ID = ?', [userId], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: 'Error deleting user' });
      }
      return res.send({ message: 'Profile deleted successfully' });
    });
  } catch (err) {
    return res.status(403).send({ error: 'Invalid token' });
  }
});


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = rows[0];
        const storedPassword = user.password;
        const isPasswordValid = await bcrypt.compare(password, storedPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.User_ID, username: user.username }, 'jwt-secret-key', { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, 
            maxAge: 3600000,
        });

        res.status(200).json({
            message: 'Login successful',
            user: { username: user.username, id: user.User_ID },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
});

app.post('/users', async (req, res) => {
  try {
    const { username, password, realname, surname, birth, city } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultDesignId = 1;
    const defaultRankId = 1; 
    const currentDate = new Date().toISOString().split('T')[0];

    const [result] = await db.query(
      `INSERT INTO Users (username, password, birthday, name, surname, city, exp, role, registration_date, fk_Design, fk_Rank)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, birth, realname, surname, city, 0, 'user', currentDate, defaultDesignId, defaultRankId]
    );

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true, // Ensure the same properties as when the cookie was set
    secure: process.env.NODE_ENV === 'production', // Match the secure flag from the set cookie
    sameSite: 'Strict', // Match the sameSite flag from the set cookie
  });

  return res.status(200).json({ message: "Logged out successfully" });
});


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Portas: ${PORT}`);
});
