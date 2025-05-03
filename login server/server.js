const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI
const uri = 'mongodb+srv://vishwanathkhuli347:1Cli35mFxP8CvrSU@cluster0.ktwmlnw.mongodb.net/login_app';

mongoose.connect(uri)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Mongo Error:', err));

// Define the User model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  client_id: String,
  client_secret: String,
  jira_url: String
});

const User = mongoose.model('User', userSchema);

// Login endpoint with debugging
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login Request Received:', { email, password });

  try {
    // Try to find the user by email
    const user = await User.findOne({ email });
    console.log('User Found in DB:', user);

    if (!user) {
      console.log(`User not found with email: ${email}`);
      return res.status(404).send('User email not found');
    }

    // Check if the password matches
    if (password === user.password) {
      console.log('Password match, login successful');
      return res.status(200).json({
        message: 'Login successful',
        user: {
          email: user.email,
          client_id: user.client_id,
          client_secret: user.client_secret,
          jira_url: user.jira_url
        }
      });
    } else {
      console.log('Password mismatch');
      return res.status(401).send('Password mismatch');
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).send('Server error');
  }
});

// Root Test
app.get('/', (req, res) => {
  console.log('Root request received');
  res.send('Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
