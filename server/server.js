const express = require('express');
const cron = require('node-cron');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Import CORS
const jwt = require('jsonwebtoken'); // Import JWT

// Define User model
const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  passwordHash: String
}, { collection: 'User' });

const User = mongoose.model('User', userSchema);

// Define Task model
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  dueDate: Date,
  reminder: String,
  column: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'Tasks' });

const Task = mongoose.model('Task', taskSchema);

const app = express();

// Middleware
app.use(cors()); // Use CORS middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT Secret
const JWT_SECRET = 'your_jwt_secret'; // Replace with your JWT secret

// Passport configuration
passport.use(new GoogleStrategy({
  clientID: "486880569229-te48aevb35vql663i8rn8dshhb5m9enn.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: '/auth/google/callback',
  scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
  const existingUser = await User.findOne({ googleId: profile.id });
  if (existingUser) {
    return done(null, existingUser);
  }
  const newUser = new User({ googleId: profile.id, name: profile.displayName });
  await newUser.save();
  done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Authentication middleware
// const authenticateJWT = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return res.sendStatus(401);
  
//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'You are authenticated' });
});

// Routes

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  const token = jwt.sign({ id: req.user.id, email: req.user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`http://localhost:3001/dashboard`);
});

app.get('/auth/logout', (req, res) => {
  res.redirect('/');
});

app.get('/auth/current_user', authenticateJWT, (req, res) => {
  res.json(req.user);
});

// User Registration
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: `${firstName} ${lastName}`,
      email,
      passwordHash: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user}); // Send token to client
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// User Logout
app.post('/api/logout', (req, res) => {
  // For JWT, there's no server-side session to destroy
  res.status(200).json({ message: 'Logged out successfully' });
});

// Task management routes
app.get('/tasks', authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

app.get('/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task details', error });
  }
});


app.post('/api/tasks', authenticateJWT, async (req, res) => {
  const { title, description, dueDate, column } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      reminder: "None",
      column,
      userId: req.user.id // The ID of the authenticated user
    });

    await newTask.save(); // Save the new task to the MongoDB collection
    res.status(201).json(newTask); // Respond with the created task
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});

app.put('/api/tasks/:id', authenticateJWT, async (req, res) => {
  const { title, description, dueDate, reminder, column } = req.body;
  console.log('Updating Task ID:', req.params.id);
  console.log('Request Body:', req.body);

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { title, description, dueDate, reminder, column }, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error });
  }
});

app.delete('/api/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

// Database connection
mongoose.connect('mongodb://localhost:27017/task_manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
