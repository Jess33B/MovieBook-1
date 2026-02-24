const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock users
let users = [];
let userIdCounter = 1;

// Mock movies
const movies = [
  {
    movieId: 1,
    title: "The Matrix",
    description: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
    genre: "Sci-Fi",
    durationMinutes: 136,
    rating: 8.7,
    price: 250,
    posterUrl: "https://image.tmdb.org/t/p/original/ulf1aY9LXciRX2IpnJksCDJOWvp.jpg",
    isActive: true
  },
  {
    movieId: 2,
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    genre: "Sci-Fi",
    durationMinutes: 148,
    rating: 8.8,
    price: 280,
    posterUrl: "https://image.tmdb.org/t/p/original/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    isActive: true
  },
  {
    movieId: 3,
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham Batman must accept one of the greatest psychological and physical tests.",
    genre: "Action",
    durationMinutes: 152,
    rating: 9.0,
    price: 300,
    posterUrl: "https://tse2.mm.bing.net/th/id/OIP.pzHzXKTcOWnvKPz1Tfyp0QHaLH",
    isActive: true
  },
  {
    movieId: 4,
    title: "Kumbalangi Nights",
    description: "A gripping tale of a police officer who investigates a series of mysterious deaths in a small village, uncovering dark secrets and confronting supernatural forces.",
    genre: "Drama",
    durationMinutes: 146,
    rating: 8.5,
    price: 320,
    posterUrl: "https://tse3.mm.bing.net/th/id/OIP.mi-kaW1gpQDDT_iZsE30xQHaK_?w=1290&h=1915&rs=1&pid=ImgDetMain&o=7&rm=3",
    isActive: true
  },
  {
    movieId: 5,
    title: "Joseph",
    description: "A powerful story about family bonds, traditions, and the challenges faced by a man trying to balance his cultural heritage with modern life.",
    genre: "Drama",
    durationMinutes: 138,
    rating: 8.2,
    price: 290,
    posterUrl: "https://th.bing.com/th/id/R.145ae37d2c20c3a1091349b447180b52?rik=IXPQAg5a7RKG6Q&riu=http%3a%2f%2fonlookersmedia.in%2fwp-content%2fuploads%2f2018%2f11%2fjoseph-malayalam-movie-poster-stills-images-2.jpg&ehk=T4yMhhbNIofhMccSk6QP3SD173qxpytb9B9jzo%2bsBr8%3d&risl=&pid=ImgRaw&r=0=joseph",
    isActive: true
  }
];

// Helper function to generate JWT-like token
const generateToken = (user) => {
  return 'token-' + user.id + '-' + Date.now() + '-' + Math.random().toString(36).substr(2);
};

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, fullName, phoneNumber } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.username === username || u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password, // In production, this should be hashed
    fullName: fullName || '',
    phoneNumber: phoneNumber || '',
    role: 'USER',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Generate token for new user
  const token = generateToken(newUser);
  
  // Return user without password but with token
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ ...userWithoutPassword, token });
});

app.post('/api/auth/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;
  
  // Handle both username and email login
  const user = users.find(u => 
    (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
  );
  
  // Special handling for admin login
  if (usernameOrEmail === 'admin' && password === '123') {
    const adminUser = {
      id: 0,
      username: 'admin',
      email: 'admin@moviebook.com',
      fullName: 'System Administrator',
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    };
    
    const token = generateToken(adminUser);
    const { password: _, ...userWithoutPassword } = adminUser;
    res.json({ ...userWithoutPassword, token });
  } else if (user) {
    // Generate token for regular user
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ ...userWithoutPassword, token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Token validation endpoint
app.get('/api/auth/validate', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  
  // Simple token validation - check if it starts with 'token-'
  if (token.startsWith('token-')) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Movies endpoints
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find(m => m.movieId == req.params.id);
  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  res.json(movie);
});

// Mock reviews with sentiment data
let reviews = [
  {
    id: 1,
    movieId: 1,
    userId: 1,
    rating: 5,
    comment: "The movie was absolutely amazing! Great action sequences and mind-blowing plot.",
    sentiment: "positive",
    sentimentScore: 0.9,
    date: "2024-01-15"
  },
  {
    id: 2,
    movieId: 1,
    userId: 2,
    rating: 4,
    comment: "Good movie but the seats were uncomfortable in the theater.",
    sentiment: "mixed",
    sentimentScore: 0.3,
    date: "2024-01-16"
  },
  {
    id: 3,
    movieId: 2,
    userId: 3,
    rating: 2,
    comment: "The movie was boring and too long. Disappointed with the storyline.",
    sentiment: "negative",
    sentimentScore: -0.7,
    date: "2024-01-17"
  },
  {
    id: 4,
    movieId: 2,
    userId: 4,
    rating: 5,
    comment: "Inception is a masterpiece! Christopher Nolan at his best.",
    sentiment: "positive",
    sentimentScore: 0.95,
    date: "2024-01-18"
  },
  {
    id: 5,
    movieId: 3,
    userId: 5,
    rating: 4,
    comment: "Dark Knight delivers intense action and emotional depth.",
    sentiment: "positive",
    sentimentScore: 0.8,
    date: "2024-01-19"
  }
];

let reviewIdCounter = 6;

// Mock user bookings
let userBookings = [
  {
    id: 1,
    userId: 1,
    movieId: 1,
    movieTitle: "The Matrix",
    theater: "PVR Cinemas",
    showTime: "7:00 PM",
    seats: ["A5", "A6"],
    date: "2024-01-20",
    status: "confirmed",
    totalCost: 600,
    posterUrl: "https://image.tmdb.org/t/p/original/ulf1aY9LXciRX2IpnJksCDJOWvp.jpg"
  },
  {
    id: 2,
    userId: 1,
    movieId: 2,
    movieTitle: "Inception",
    theater: "INOX",
    showTime: "9:30 PM",
    seats: ["C7", "C8", "C9"],
    date: "2024-01-25",
    status: "pending",
    totalCost: 900,
    posterUrl: "https://image.tmdb.org/t/p/original/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg"
  }
];

// Reviews endpoints
app.get('/api/reviews/movie/:movieId', (req, res) => {
  const movieReviews = reviews.filter(r => r.movieId == req.params.movieId);
  res.json(movieReviews);
});

app.post('/api/reviews', (req, res) => {
  const newReview = {
    id: reviewIdCounter++,
    ...req.body,
    date: new Date().toISOString()
  };
  reviews.push(newReview);
  res.json(newReview);
});

// User bookings endpoints
app.get('/api/bookings/user/:userId', (req, res) => {
  const userBookingList = userBookings.filter(b => b.userId == req.params.userId);
  res.json(userBookingList);
});

app.post('/api/bookings', (req, res) => {
  const newBooking = {
    id: userBookings.length + 1,
    ...req.body,
    status: "confirmed",
    date: new Date().toISOString()
  };
  userBookings.push(newBooking);
  res.json(newBooking);
});

// Admin endpoints
app.get('/api/admin/users', (req, res) => {
  res.json(users);
});

app.get('/api/admin/bookings', (req, res) => {
  res.json(userBookings);
});

app.get('/api/admin/reviews', (req, res) => {
  res.json(reviews);
});

// Dynamic keyword extraction from reviews
app.get('/api/analytics/keywords/:movieId', (req, res) => {
  const movieReviews = reviews.filter(r => r.movieId == req.params.movieId);
  const keywords = {};
  
  movieReviews.forEach(review => {
    const words = review.comment.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) { // Only count words longer than 3 characters
        keywords[word] = (keywords[word] || 0) + 1;
      }
    });
  });
  
  // Sort by frequency and return top 10
  const sortedKeywords = Object.entries(keywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  
  res.json(sortedKeywords);
});

// Mock booking data for predictive analytics
const bookingData = [
  { date: "2024-01-01", tickets: 120, revenue: 36000 },
  { date: "2024-01-02", tickets: 150, revenue: 45000 },
  { date: "2024-01-03", tickets: 180, revenue: 54000 },
  { date: "2024-01-04", tickets: 200, revenue: 60000 },
  { date: "2024-01-05", tickets: 220, revenue: 66000 },
  { date: "2024-01-06", tickets: 250, revenue: 75000 },
  { date: "2024-01-07", tickets: 280, revenue: 84000 }
];

// Analytics endpoints
app.get('/api/analytics/sentiment/:movieId', (req, res) => {
  const movieReviews = reviews.filter(r => r.movieId == req.params.movieId);
  const sentimentData = {
    total: movieReviews.length,
    positive: movieReviews.filter(r => r.sentiment === 'positive').length,
    negative: movieReviews.filter(r => r.sentiment === 'negative').length,
    mixed: movieReviews.filter(r => r.sentiment === 'mixed').length,
    averageSentiment: movieReviews.reduce((sum, r) => sum + r.sentimentScore, 0) / movieReviews.length || 0
  };
  res.json(sentimentData);
});

app.get('/api/analytics/keywords/:movieId', (req, res) => {
  const movieReviews = reviews.filter(r => r.movieId == req.params.movieId);
  const keywords = {
    "action": 15,
    "amazing": 12,
    "boring": 8,
    "emotional": 10,
    "plot": 9,
    "storyline": 7,
    "masterpiece": 6,
    "intense": 8
  };
  res.json(keywords);
});

app.get('/api/analytics/sales', (req, res) => {
  res.json(bookingData);
});

app.get('/api/analytics/predictions', (req, res) => {
  // Simple linear regression prediction
  const lastValue = bookingData[bookingData.length - 1].tickets;
  const growth = bookingData[bookingData.length - 1].tickets - bookingData[bookingData.length - 2].tickets;
  const predicted = lastValue + growth;
  
  res.json({
    nextDayPrediction: predicted,
    weeklyPrediction: predicted * 7,
    monthlyPrediction: predicted * 30,
    confidence: 0.85,
    trend: growth > 0 ? "increasing" : "decreasing"
  });
});

app.get('/api/analytics/dashboard', (req, res) => {
  const dashboardData = {
    totalBookings: bookingData.reduce((sum, b) => sum + b.tickets, 0),
    totalRevenue: bookingData.reduce((sum, b) => sum + b.revenue, 0),
    averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0,
    totalReviews: reviews.length,
    topMovies: movies.map(movie => ({
      id: movie.movieId,
      title: movie.title,
      bookings: Math.floor(Math.random() * 500) + 100,
      revenue: Math.floor(Math.random() * 50000) + 10000
    })).sort((a, b) => b.bookings - a.bookings)
  };
  res.json(dashboardData);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Enhanced Mock server with analytics running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('POST /api/auth/register');
  console.log('POST /api/auth/login');
  console.log('GET /api/movies');
  console.log('GET /api/movies/:id');
  console.log('GET /api/analytics/sentiment/:movieId');
  console.log('GET /api/analytics/keywords/:movieId');
  console.log('GET /api/analytics/sales');
  console.log('GET /api/analytics/predictions');
  console.log('GET /api/analytics/dashboard');
});
