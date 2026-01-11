const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes (We will add these next)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/shipping', require('./routes/shippingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/deals', require('./routes/dealRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html')));
}

// Error Handler Middleware
app.use(errorHandler);

// app.listen(port, () => console.log(`Server started on port ${port}`.yellow));
app.listen(port, '0.0.0.0', () => console.log(`Server started on port ${port}`));