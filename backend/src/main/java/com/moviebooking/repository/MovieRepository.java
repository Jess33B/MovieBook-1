package com.moviebooking.repository;

import com.moviebooking.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByIsActive(Boolean isActive);
    
    @Query("SELECT m FROM Movie m WHERE m.isActive = true ORDER BY m.createdAt DESC")
    List<Movie> findActiveMoviesOrderByDate();
    
    List<Movie> findByGenre(String genre);
    
    @Query("SELECT m FROM Movie m WHERE m.title LIKE %:title% AND m.isActive = true")
    List<Movie> searchMoviesByTitle(String title);
}
