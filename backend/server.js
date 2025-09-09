const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const config = require('./config');

const app = express();
const PORT = config.port;

app.use(cors({
  origin: '*',
  methods: "*",
  allowedHeaders: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  multipleStatements: true
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  initializeDatabase();
});

function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS breeds (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      origin VARCHAR(255) NOT NULL,
      size VARCHAR(100) NOT NULL,
      temperament VARCHAR(255) NOT NULL,
      lifespan VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Breeds table ready');
    
    insertSampleData();
  });
}

function insertSampleData() {
  db.query('SELECT COUNT(*) as count FROM breeds', (err, result) => {
    if (err) {
      console.error('Error checking table:', err);
      return;
    }
    
    if (result[0].count === 0) {
      const sampleData = [
        ['Golden Retriever', 'Scotland', 'Large', 'Friendly, Intelligent, Devoted', '10-12 years', 'The Golden Retriever is a medium-large gun dog that was bred to retrieve shot waterfowl, such as ducks and upland game birds, during hunting and shooting parties.'],
        ['German Shepherd', 'Germany', 'Large', 'Confident, Courageous, Smart', '9-13 years', 'The German Shepherd is a breed of medium to large-sized working dog that originated in Germany. Known for their intelligence and versatility.'],
        ['French Bulldog', 'France', 'Small', 'Adaptable, Playful, Smart', '10-12 years', 'The French Bulldog is a small breed of domestic dog. Frenchies were the result in the 1800s of a cross between bulldog ancestors imported from England and local ratters in Paris.'],
        ['Labrador Retriever', 'Canada', 'Large', 'Outgoing, Active, Friendly', '10-14 years', 'The Labrador Retriever is a medium-large breed of retriever-gun dog. The Labrador is the most popular breed of dog in many countries around the world.'],
        ['Beagle', 'England', 'Medium', 'Friendly, Curious, Merry', '13-16 years', 'The Beagle is a breed of small hound that is similar in appearance to the much larger foxhound. The beagle is a scent hound, developed primarily for hunting hare.']
      ];
      
      const insertQuery = 'INSERT INTO breeds (name, origin, size, temperament, lifespan, description) VALUES ?';
      db.query(insertQuery, [sampleData], (err) => {
        if (err) {
          console.error('Error inserting sample data:', err);
          return;
        }
        console.log('Sample data inserted successfully');
      });
    } else {
      console.log('Database already contains data');
    }
  });
}

app.get('/api/breeds', (req, res) => {
  const sql = 'SELECT * FROM breeds ORDER BY name';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching breeds:', err);
      return res.status(500).json({ error: 'Failed to fetch breeds' });
    }
    res.json(result);
  });
});

app.get('/api/breeds/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM breeds WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching breed:', err);
      return res.status(500).json({ error: 'Failed to fetch breed' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Breed not found' });
    }
    res.json(result[0]);
  });
});

app.post('/api/breeds', (req, res) => {
  const { name, origin, size, temperament, lifespan, description } = req.body;
  
  if (!name || !origin || !size || !temperament || !lifespan || !description) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  const sql = 'INSERT INTO breeds (name, origin, size, temperament, lifespan, description) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, origin, size, temperament, lifespan, description];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'A breed with this name already exists' });
      }
      console.error('Error creating breed:', err);
      return res.status(500).json({ error: 'Failed to create breed' });
    }
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Breed created successfully',
      breed: { id: result.insertId, name, origin, size, temperament, lifespan, description }
    });
  });
});

app.put('/api/breeds/:id', (req, res) => {
  const { id } = req.params;
  const { name, origin, size, temperament, lifespan, description } = req.body;
  
  if (!name || !origin || !size || !temperament || !lifespan || !description) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  const sql = 'UPDATE breeds SET name = ?, origin = ?, size = ?, temperament = ?, lifespan = ?, description = ? WHERE id = ?';
  const values = [name, origin, size, temperament, lifespan, description, id];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'A breed with this name already exists' });
      }
      console.error('Error updating breed:', err);
      return res.status(500).json({ error: 'Failed to update breed' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Breed not found' });
    }
    res.json({ 
      message: 'Breed updated successfully',
      breed: { id, name, origin, size, temperament, lifespan, description }
    });
  });
});

app.delete('/api/breeds/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM breeds WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting breed:', err);
      return res.status(500).json({ error: 'Failed to delete breed' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Breed not found' });
    }
    res.json({ message: 'Breed deleted successfully' });
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pet Breed Management API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
