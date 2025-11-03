import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  test('should verify valid JWT token', () => {
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'test-secret');
    mockRequest.headers.authorization = `Bearer ${token}`;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
    
    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe(1);
  });

  test('should reject invalid JWT token', () => {
    const invalidToken = 'invalid.token.here';
    
    expect(() => {
      jwt.verify(invalidToken, process.env.JWT_SECRET || 'test-secret');
    }).toThrow();
  });

  test('should reject expired JWT token', () => {
    const expiredToken = jwt.sign(
      { userId: 1 },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '0s' }
    );

    // Attendre un peu pour que le token expire
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(() => {
          jwt.verify(expiredToken, process.env.JWT_SECRET || 'test-secret');
        }).toThrow();
        resolve();
      }, 100);
    });
  });
});
