const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const seedRoles = require('./utils/seedRoles');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'http://localhost:5173'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  res.setHeader(
    'Access-Control-Allow-Credentials',
    'true'
  );

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connection successful');

    await seedRoles();
  })
  .catch((e) => {
    console.log('Error', e);
  });

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});