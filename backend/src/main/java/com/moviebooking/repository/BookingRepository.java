package com.moviebooking.repository;

import com.moviebooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserUserId(Long userId);
    
    List<Booking> findByMovieMovieId(Long movieId);
    
    @Query("SELECT b FROM Booking b WHERE b.user.userId = :userId ORDER BY b.createdAt DESC")
    List<Booking> findUserBookingsOrderByDate(Long userId);
    
    @Query("SELECT b FROM Booking b WHERE b.showTime >= :now ORDER BY b.showTime")
    List<Booking> findUpcomingBookings(java.time.LocalDateTime now);
}
