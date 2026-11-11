
const express = require('express');
const axios = require('axios');

require('dotenv').config();

const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!')
  })
  .catch((error) => {
    console.error('MongoDB Connection Error:', error.message)
  })


console.log('TMDB Token Loaded:', Boolean(process.env.TMDB_ACCESS_TOKEN));


const app = express();

const PORT = 5000;

app.get('/api/health', (req, res) => {
  res.send('CineMatch Backend is Running!');
});

app.get('/api/movies/popular', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.themoviedb.org/3/movie/popular',
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          accept: 'application/json'
        }
      }
    );

   const data = response.data;
    res.json(data.results);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Something went wrong'
    });
  }
});

app.get('/api/movies/search', async (req, res) => {
  try {
    const query = req.query.query

    if (!query) {
      return res.json([])
    }

    const response = await axios.get(
      'https://api.themoviedb.org/3/search/movie',
      {
        params: { query },
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
        }
      }
    )

    res.json(response.data.results)
  } catch (error) {
    console.error('Movie search error:', error.message)
    res.status(500).json({ error: 'Failed to search movies' })
  }
})


app.use(express.json())

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {}

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== 'string' || password.length < 8
    ) {
      return res.status(400).json({
        message: 'Enter a name, valid email and password of at least 8 characters'
      })
    }

    const cleanEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({ email: cleanEmail })

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword
    })

    res.status(201).json({
      message: 'Signup successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email already registered'
      })
    }

    console.error('Signup error:', error.message)
    res.status(500).json({
      message: 'Signup failed'
    })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    })

    const isValid = user &&
      await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing')
      return res.status(500).json({
        message: 'Login configuration error'
      })
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.cookie('cinematch_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    })

    res.json({
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({
      message: 'Login failed'
    })
  }
})

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id

    if (!/^\d+$/.test(movieId)) {
      return res.status(400).json({
        message: 'Invalid movie ID'
      })
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
        }
      }
    )

    res.json(response.data)

  } catch (error) {
    console.error('Movie details error:', error.message)

    res.status(error.response?.status === 404 ? 404 : 500).json({
      message: 'Could not fetch movie details'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
