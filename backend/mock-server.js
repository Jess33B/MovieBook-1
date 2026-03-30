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
    description: "A computer hacker discovers that reality as he knows it is a simulation and joins a rebellion against its controllers.",
    genre: "Sci-Fi",
    durationMinutes: 136,
    rating: 8.7,
    price: 250,
    posterUrl: "https://image.tmdb.org/t/p/original/ulf1aY9LXciRX2IpnJksCDJOWvp.jpg",
    isActive: true,
    trailer: "https://www.youtube.com/embed/vKQi3bBA1y8",
    cast: [
      { name: "Keanu Reeves", role: "Neo" },
      { name: "Laurence Fishburne", role: "Morpheus" },
      { name: "Carrie-Anne Moss", role: "Trinity" }
    ],
    director: "Lana Wachowski, Lilly Wachowski",
    story: "A computer hacker discovers that reality as he knows it is a simulation and joins a rebellion against its controllers."
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
    isActive: true,
    trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
    cast: [
      { name: "Leonardo DiCaprio", role: "Dom Cobb" },
      { name: "Joseph Gordon-Levitt", role: "Arthur" },
      { name: "Ellen Page", role: "Ariadne" }
    ],
    director: "Christopher Nolan",
    story: "A skilled thief enters people's dreams to steal secrets but is tasked with planting an idea instead."
  },
  {
    movieId: 3,
    title: "The Dark Knight",
    description: "When the Joker unleashes chaos on Gotham, Batman faces one of the toughest psychological and moral challenges of his life.",
    genre: "Action",
    durationMinutes: 152,
    rating: 9.0,
    price: 300,
    posterUrl: "https://tse2.mm.bing.net/th/id/OIP.pzHzXKTcOWnvKPz1Tfyp0QHaLH",
    isActive: true,
    trailer: "https://www.youtube.com/embed/EXeTwQWrcwY",
    cast: [
      { name: "Christian Bale", role: "Bruce Wayne/Batman" },
      { name: "Heath Ledger", role: "Joker" },
      { name: "Aaron Eckhart", role: "Harvey Dent" }
    ],
    director: "Christopher Nolan",
    story: "When the Joker unleashes chaos on Gotham, Batman faces one of the toughest psychological and moral challenges of his life."
  },
  {
    movieId: 4,
    title: "Kumbalangi Nights",
    description: "A heartfelt story of four brothers navigating love, relationships, and personal struggles in a coastal village.",
    genre: "Drama",
    durationMinutes: 135,
    rating: 8.5,
    price: 320,
    posterUrl: "https://tse3.mm.bing.net/th/id/OIP.mi-kaW1gpQDDT_iZsE30xQHaK_?w=1290&h=1915&rs=1&pid=ImgDetMain&o=7&rm=3",
    isActive: true,
    trailer: "https://www.youtube.com/embed/3P4BFBSafF0",
    cast: [
      { name: "Shane Nigam", role: "Saji" },
      { name: "Soubin Shahir", role: "Bobby" },
      { name: "Fahadh Faasil", role: "Shammi" }
    ],
    director: "Madhu C. Narayanan",
    story: "A heartfelt story of four brothers navigating love, relationships, and personal struggles in a coastal village."
  },
  {
    movieId: 5,
    title: "Joseph",
    description: "A retired police officer investigates a case that becomes deeply personal, uncovering emotional and dark truths.",
    genre: "Drama / Thriller",
    durationMinutes: 138,
    rating: 8.2,
    price: 290,
    posterUrl: "https://th.bing.com/th/id/R.145ae37d2c20c3a1091349b447180b52?rik=IXPQAg5a7RKG6Q&riu=http%3a%2f%2fonlookersmedia.in%2fwp-content%2fuploads%2f2018%2f11%2fjoseph-malayalam-movie-poster-stills-images-2.jpg&ehk=T4yMhhbNIofhMccSk6QP3SD173qxpytb9B9jzo%2bsBr8%3d&risl=&pid=ImgRaw&r=0=joseph",
    isActive: true,
    trailer: "https://www.youtube.com/embed/R2gZ1GqXyWk",
    cast: [
      { name: "Joju George", role: "Joseph" },
      { name: "Athmeeya Rajan", role: "Stella" }
    ],
    director: "M. Padmakumar",
    story: "A retired police officer investigates a case that becomes deeply personal, uncovering emotional and dark truths."
  },
  {
    movieId: 6,
    title: "M.S. Dhoni: The Untold Story",
    description: "The inspiring journey of cricketer Mahendra Singh Dhoni from a small-town boy to India's most successful captain.",
    genre: "Biography / Sports",
    durationMinutes: 184,
    rating: 7.9,
    price: 270,
    posterUrl: "https://tse4.mm.bing.net/th/id/OIP.msisfSHJ1H4SKFAvV0EnEgHaKs?rs=1&pid=ImgDetMain&o=7&rm=3",
    isActive: true,
    trailer: "https://www.youtube.com/embed/6L6XqWoS8tw",
    cast: [
      { name: "Sushant Singh Rajput", role: "MS Dhoni" },
      { name: "Kiara Advani", role: "Sakshi" },
      { name: "Disha Patani", role: "Priyanka" }
    ],
    director: "Neeraj Pandey",
    story: "The inspiring journey of Mahendra Singh Dhoni from a small-town boy to India's most successful captain."
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
  // The Matrix Reviews
  {
    id: 1,
    movieId: 1,
    userId: 1,
    rating: 5,
    comment: "The Matrix is absolutely mind-blowing! The action sequences and philosophical themes are incredible.",
    sentiment: "positive",
    sentimentScore: 0.9,
    date: "2024-01-15",
    user: "JohnDoe"
  },
  {
    id: 2,
    movieId: 1,
    userId: 2,
    rating: 4,
    comment: "Great movie but the seats were uncomfortable in the theater.",
    sentiment: "mixed",
    sentimentScore: 0.3,
    date: "2024-01-16",
    user: "JaneSmith"
  },
  {
    id: 3,
    movieId: 1,
    userId: 3,
    rating: 5,
    comment: "Keanu Reeves at his best! The visual effects were groundbreaking for 1999.",
    sentiment: "positive",
    sentimentScore: 0.95,
    date: "2024-01-17",
    user: "MovieBuff"
  },
  
  // Inception Reviews
  {
    id: 4,
    movieId: 2,
    userId: 4,
    rating: 5,
    comment: "Inception is a masterpiece! Christopher Nolan at his best.",
    sentiment: "positive",
    sentimentScore: 0.95,
    date: "2024-01-18",
    user: "FilmCritic"
  },
  {
    id: 5,
    movieId: 2,
    userId: 5,
    rating: 3,
    comment: "The movie was too complex and hard to follow.",
    sentiment: "negative",
    sentimentScore: -0.4,
    date: "2024-01-19",
    user: "CasualViewer"
  },
  {
    id: 6,
    movieId: 2,
    userId: 6,
    rating: 4,
    comment: "Amazing concept and execution. Leo was brilliant as always.",
    sentiment: "positive",
    sentimentScore: 0.8,
    date: "2024-01-20",
    user: "LeoFan"
  },
  
  // The Dark Knight Reviews
  {
    id: 7,
    movieId: 3,
    userId: 7,
    rating: 5,
    comment: "Heath Ledger's Joker is legendary! Best superhero movie ever.",
    sentiment: "positive",
    sentimentScore: 0.98,
    date: "2024-01-21",
    user: "BatmanFan"
  },
  {
    id: 8,
    movieId: 3,
    userId: 8,
    rating: 4,
    comment: "Dark Knight delivers intense action and emotional depth.",
    sentiment: "positive",
    sentimentScore: 0.8,
    date: "2024-01-22",
    user: "ActionLover"
  },
  
  // Kumbalangi Nights Reviews
  {
    id: 9,
    movieId: 4,
    userId: 9,
    rating: 5,
    comment: "Beautiful Malayalam cinema! Fahadh Faasil's performance was outstanding.",
    sentiment: "positive",
    sentimentScore: 0.9,
    date: "2024-01-23",
    user: "MalayalamCinema"
  },
  {
    id: 10,
    movieId: 4,
    userId: 10,
    rating: 4,
    comment: "Heartwarming story about family bonds and relationships.",
    sentiment: "positive",
    sentimentScore: 0.7,
    date: "2024-01-24",
    user: "FamilyDrama"
  },
  
  // Joseph Reviews
  {
    id: 11,
    movieId: 5,
    userId: 11,
    rating: 4,
    comment: "Joju George delivers a powerful performance. Gripping storyline.",
    sentiment: "positive",
    sentimentScore: 0.8,
    date: "2024-01-25",
    user: "ThrillerFan"
  },
  {
    id: 12,
    movieId: 5,
    userId: 12,
    rating: 3,
    comment: "Good mystery but pacing was a bit slow in parts.",
    sentiment: "mixed",
    sentimentScore: 0.1,
    date: "2024-01-26",
    user: "MysteryLover"
  },
  
  // MS Dhoni Reviews
  {
    id: 13,
    movieId: 6,
    userId: 13,
    rating: 4,
    comment: "Sushant Singh Rajput was perfect as Dhoni! Emotional journey.",
    sentiment: "positive",
    sentimentScore: 0.8,
    date: "2024-01-27",
    user: "CricketFan"
  },
  {
    id: 14,
    movieId: 6,
    userId: 14,
    rating: 3,
    comment: "Good biopic but could have been shorter. Too much focus on romance.",
    sentiment: "mixed",
    sentimentScore: 0.2,
    date: "2024-01-28",
    user: "SportsMovie"
  }
];

let reviewIdCounter = 6;

// Mock user bookings - empty by default, will be populated when users make bookings
let bookingIdCounter = 1;
let userBookings = [];

// Mock bookmarks
let userBookmarks = [
  {
    id: 1,
    userId: 1,
    movieId: 1,
    movieTitle: "The Matrix",
    posterUrl: "https://image.tmdb.org/t/p/original/ulf1aY9LXciRX2IpnJksCDJOWvp.jpg",
    genre: "Sci-Fi",
    rating: 8.7,
    price: 250
  },
  {
    id: 2,
    userId: 1,
    movieId: 3,
    movieTitle: "The Dark Knight",
    posterUrl: "https://tse2.mm.bing.net/th/id/OIP.pzHzXKTcOWnvKPz1Tfyp0QHaLH",
    genre: "Action",
    rating: 9.0,
    price: 300
  }
];

// Mock wallets
let userWallets = [
  {
    userId: 1,
    balance: 1500
  }
];

// Mock shows
let shows = [];

// Mock payment methods - empty by default, will be populated when users add them
let paymentMethods = [];

let paymentMethodIdCounter = 1;

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
    id: bookingIdCounter++,
    userId: req.body.userId || 1,
    movieId: req.body.movieId,
    movieTitle: req.body.movieTitle,
    theater: req.body.theater,
    showTime: req.body.showTime,
    seats: req.body.seats,
    date: req.body.date,
    total: req.body.total,
    posterUrl: req.body.posterUrl,
    status: "confirmed",
    userName: req.body.userName || "User",
    createdAt: new Date().toISOString()
  };
  userBookings.push(newBooking);
  console.log('New booking added:', newBooking);
  res.json(newBooking);
});

// Bookmarks endpoints
app.get('/api/bookmarks/user/:userId', (req, res) => {
  const userBookmarkList = userBookmarks.filter(b => b.userId == req.params.userId);
  res.json(userBookmarkList);
});

app.post('/api/bookmarks', (req, res) => {
  const newBookmark = {
    id: userBookmarks.length + 1,
    ...req.body
  };
  userBookmarks.push(newBookmark);
  res.json(newBookmark);
});

app.delete('/api/bookmarks/:id', (req, res) => {
  const index = userBookmarks.findIndex(b => b.id == req.params.id);
  if (index !== -1) {
    userBookmarks.splice(index, 1);
    res.json({ message: 'Bookmark removed successfully' });
  } else {
    res.status(404).json({ message: 'Bookmark not found' });
  }
});

// Wallet endpoints
app.get('/api/wallet/user/:userId', (req, res) => {
  const wallet = userWallets.find(w => w.userId == req.params.userId);
  if (!wallet) {
    // Create wallet if it doesn't exist
    const newWallet = {
      userId: parseInt(req.params.userId),
      balance: 0
    };
    userWallets.push(newWallet);
    res.json(newWallet);
  } else {
    res.json(wallet);
  }
});

app.post('/api/wallet/add-money', (req, res) => {
  const { userId, amount } = req.body;
  const wallet = userWallets.find(w => w.userId == userId);
  
  if (!wallet) {
    // Create wallet if it doesn't exist
    const newWallet = {
      userId: userId,
      balance: amount
    };
    userWallets.push(newWallet);
    res.json(newWallet);
  } else {
    wallet.balance += amount;
    res.json(wallet);
  }
});

app.post('/api/wallet/deduct', (req, res) => {
  const { userId, amount } = req.body;
  const wallet = userWallets.find(w => w.userId == userId);
  
  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }
  
  if (wallet.balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }
  
  wallet.balance -= amount;
  res.json(wallet);
});

// Payment methods endpoints
app.get('/api/payment-methods/user/:userId', (req, res) => {
  const userPaymentMethods = paymentMethods.filter(p => p.userId == req.params.userId);
  res.json(userPaymentMethods);
});

app.post('/api/payment-methods/add', (req, res) => {
  const newPaymentMethod = {
    id: paymentMethodIdCounter++,
    ...req.body
  };
  paymentMethods.push(newPaymentMethod);
  res.json(newPaymentMethod);
});

app.delete('/api/payment-methods/:id', (req, res) => {
  const index = paymentMethods.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    paymentMethods.splice(index, 1);
    res.json({ message: 'Payment method removed successfully' });
  } else {
    res.status(404).json({ message: 'Payment method not found' });
  }
});

// Admin management endpoints
app.get('/api/admin/shows', (req, res) => {
  res.json(shows);
});

app.post('/api/admin/movies', (req, res) => {
  const { title, description, genre, durationMinutes, rating, price, posterUrl, trailer, cast, director, story, isActive } = req.body;
  
  // Validate required fields
  if (!title || !genre || !durationMinutes || !rating || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Check for duplicate movie
  const exists = movies.some(m => m.title.toLowerCase() === title.toLowerCase());
  if (exists) {
    return res.status(400).json({ message: 'Movie with this title already exists' });
  }
  
  const newMovie = {
    movieId: movies.length + 1,
    title: sanitizeInput(title),
    description: sanitizeInput(description),
    genre: sanitizeInput(genre),
    durationMinutes: parseInt(durationMinutes),
    rating: parseFloat(rating),
    price: parseFloat(price),
    posterUrl: sanitizeInput(posterUrl),
    trailer: sanitizeInput(trailer),
    cast: cast || [],
    director: sanitizeInput(director),
    story: sanitizeInput(story),
    isActive: isActive !== false
  };
  
  movies.push(newMovie);
  res.json(newMovie);
});

app.put('/api/admin/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const movieIndex = movies.findIndex(m => m.movieId === movieId);
  
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  
  const { title, description, genre, durationMinutes, rating, price, posterUrl, trailer, cast, director, story, isActive } = req.body;
  
  movies[movieIndex] = {
    ...movies[movieIndex],
    title: sanitizeInput(title),
    description: sanitizeInput(description),
    genre: sanitizeInput(genre),
    durationMinutes: parseInt(durationMinutes),
    rating: parseFloat(rating),
    price: parseFloat(price),
    posterUrl: sanitizeInput(posterUrl),
    trailer: sanitizeInput(trailer),
    cast: cast ? cast.split(',').map(name => ({ name: name.trim(), role: 'Actor' })) : movies[movieIndex].cast,
    director: sanitizeInput(director),
    story: sanitizeInput(story),
    isActive: isActive !== false
  };
  
  res.json(movies[movieIndex]);
});

app.delete('/api/admin/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const movieIndex = movies.findIndex(m => m.movieId === movieId);
  
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  
  // Check if movie has active bookings
  const movieBookings = userBookings.filter(b => b.movieId === movieId && b.status === 'confirmed');
  if (movieBookings.length > 0) {
    return res.status(400).json({ message: 'Cannot delete movie with active bookings' });
  }
  
  movies.splice(movieIndex, 1);
  res.json({ message: 'Movie deleted successfully' });
});

app.post('/api/admin/shows', (req, res) => {
  const { movieId, theater, screen, time, date, availableSeats } = req.body;
  
  // Validate required fields
  if (!movieId || !theater || !screen || !time || !date || !availableSeats) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const newShow = {
    id: shows.length + 1,
    movieId: parseInt(movieId),
    theater: sanitizeInput(theater),
    screen: sanitizeInput(screen),
    time: sanitizeInput(time),
    date: sanitizeInput(date),
    availableSeats: parseInt(availableSeats)
  };
  
  shows.push(newShow);
  res.json(newShow);
});

app.delete('/api/admin/shows/:id', (req, res) => {
  const showId = parseInt(req.params.id);
  const showIndex = shows.findIndex(s => s.id === showId);
  
  if (showIndex === -1) {
    return res.status(404).json({ message: 'Show not found' });
  }
  
  shows.splice(showIndex, 1);
  res.json({ message: 'Show deleted successfully' });
});

// Seat locking endpoints
let seatLocks = [];

app.get('/api/seat-locks/:movieId/:theaterId/:showTime', (req, res) => {
  const { movieId, theaterId, showTime } = req.params;
  const locks = seatLocks.filter(lock => 
    lock.movieId == movieId && 
    lock.theaterId == theaterId && 
    lock.showTime == showTime &&
    Date.now() < lock.expiresAt
  );
  res.json(locks);
});

app.post('/api/seat-locks', (req, res) => {
  const { lockId, userId, movieId, theaterId, showTime, seats, expiresAt } = req.body;
  
  const newLock = {
    lockId,
    userId,
    movieId,
    theaterId,
    showTime,
    seats,
    expiresAt: new Date(expiresAt).getTime()
  };
  
  seatLocks.push(newLock);
  res.json(newLock);
});

app.delete('/api/seat-locks/:lockKey/:userId', (req, res) => {
  const { lockKey, userId } = req.params;
  
  seatLocks = seatLocks.filter(lock => 
    !(lock.movieId && lock.theaterId && lock.showTime == lockKey)
  );
  
  res.json({ message: 'Lock released successfully' });
});

// Input sanitization helper
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*<\/script>|<\/script>)/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};
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
