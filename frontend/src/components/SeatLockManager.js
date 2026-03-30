import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Seat locking system
const SeatLockManager = () => {
  const [lockedSeats, setLockedSeats] = useState(new Set());
  const [userLocks, setUserLocks] = useState({});

  // Lock seats for a user
  const lockSeats = async (userId, movieId, theaterId, showTime, seats, timeoutMinutes = 15) => {
    const lockKey = `${movieId}-${theaterId}-${showTime}`;
    const lockId = Date.now();
    
    try {
      // Check if seats are already locked
      const seatLocks = await axios.get(`http://localhost:8080/api/seat-locks/${movieId}/${theaterId}/${showTime}`);
      
      const conflictingLocks = seatLocks.data.filter(lock => 
        lock.userId !== userId && seats.some(seat => lock.seats.includes(seat))
      );
      
      if (conflictingLocks.length > 0) {
        return { 
          success: false, 
          message: 'Some seats are already locked by another user',
          lockedBy: conflictingLocks[0].userId
        };
      }

      // Create new lock
      await axios.post('http://localhost:8080/api/seat-locks', {
        lockId,
        userId,
        movieId,
        theaterId,
        showTime,
        seats,
        expiresAt: new Date(Date.now() + timeoutMinutes * 60000).toISOString()
      });

      // Update local state
      setLockedSeats(prev => new Set([...prev, ...seats]));
      setUserLocks(prev => ({ ...prev, [lockKey]: { lockId, seats, expiresAt: Date.now() + timeoutMinutes * 60000 } }));

      return { success: true, lockId };
    } catch (error) {
      console.error('Error locking seats:', error);
      return { success: false, message: 'Failed to lock seats' };
    }
  };

  // Release seats
  const releaseSeats = async (userId, movieId, theaterId, showTime) => {
    const lockKey = `${movieId}-${theaterId}-${showTime}`;
    
    try {
      await axios.delete(`http://localhost:8080/api/seat-locks/${lockKey}/${userId}`);
      
      // Update local state
      setLockedSeats(new Set());
      setUserLocks(prev => {
        const newLocks = { ...prev };
        delete newLocks[lockKey];
        return newLocks;
      });

      return { success: true };
    } catch (error) {
      console.error('Error releasing seats:', error);
      return { success: false, message: 'Failed to release seats' };
    }
  };

  // Check lock status
  const checkLockStatus = (movieId, theaterId, showTime) => {
    const lockKey = `${movieId}-${theaterId}-${showTime}`;
    const userLock = userLocks[lockKey];
    
    if (!userLock) return { locked: false };
    
    const now = Date.now();
    const isExpired = now > userLock.expiresAt;
    
    return {
      locked: true,
      expired: isExpired,
      seats: userLock.seats || [],
      lockId: userLock.lockId
    };
  };

  // Auto-cleanup expired locks
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      Object.entries(userLocks).forEach(([key, lock]) => {
        if (now > lock.expiresAt) {
          setUserLocks(prev => {
            const newLocks = { ...prev };
            delete newLocks[key];
            return newLocks;
          });
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [userLocks]);

  return {
    lockedSeats,
    userLocks,
    lockSeats,
    releaseSeats,
    checkLockStatus
  };
};

export default SeatLockManager;
