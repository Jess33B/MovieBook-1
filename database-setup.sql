-- Movie Booking Database Setup
-- Create database
CREATE DATABASE movie_booking_db;

-- Connect to the database
\c movie_booking_db;

-- Create users table
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    CONSTRAINT role_check CHECK (role IN ('USER', 'ADMIN', 'MANAGER'))
);

-- Create movies table
CREATE TABLE movies (
    movie_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    release_date TIMESTAMP,
    poster_url VARCHAR(500),
    rating DECIMAL(3,1),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE bookings (
    booking_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    show_time TIMESTAMP NOT NULL,
    seats_booked INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'CONFIRMED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_movies_genre ON movies(genre);
CREATE INDEX idx_movies_active ON movies(is_active);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_movie ON bookings(movie_id);
CREATE INDEX idx_bookings_show_time ON bookings(show_time);

-- Insert sample movies
INSERT INTO movies (title, genre, duration_minutes, price, description, rating) VALUES
('The Matrix', 'Sci-Fi', 136, 12.99, 'A computer hacker learns about the nature of reality and his role in the war against its controllers.', 8.7),
('Inception', 'Sci-Fi', 148, 14.99, 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', 8.8),
('The Dark Knight', 'Action', 152, 13.99, 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 9.0),
('Pulp Fiction', 'Crime', 154, 11.99, 'The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence.', 8.9),
('Forrest Gump', 'Drama', 142, 10.99, 'The presidencies of Kennedy and Johnson, the Vietnam War, and the Watergate scandal unfold from the perspective of an Alabama man.', 8.8);

-- Grant permissions (adjust username as needed)
GRANT ALL PRIVILEGES ON DATABASE movie_booking_db TO postgres;
