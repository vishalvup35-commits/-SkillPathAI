import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // login + register attempts per IP per hour
  skipSuccessfulRequests: true, // only failed attempts count
  message: { message: 'Too many authentication attempts from this IP, please try again after an hour' },
  standardHeaders: true,
  legacyHeaders: false,
});