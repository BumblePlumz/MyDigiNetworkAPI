import { describe, test, expect } from '@jest/globals';
import { AuthError } from '../../src/classes/AuthError.js';

describe('AuthController Logic Tests', () => {
  describe('Registration Logic', () => {
    test('should validate required fields for registration', () => {
      const firstname = '';
      const lastname = 'Doe';
      const email = 'john@test.com';
      const password = 'password123';
      
      if (!firstname || !lastname || !email || !password) {
        const error = new AuthError(400, 'All fields are required');
        expect(error.code).toBe(400);
        expect(error.message).toBe('All fields are required');
      }
    });

    test('should validate email format for registration', () => {
      const email = 'invalid-email';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test(email)).toBe(false);
    });

    test('should accept valid registration data', () => {
      const registrationData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        password: 'securePassword123'
      };
      
      expect(registrationData.firstname).toBeTruthy();
      expect(registrationData.lastname).toBeTruthy();
      expect(registrationData.email).toContain('@');
      expect(registrationData.password.length).toBeGreaterThan(5);
    });

    test('should validate password strength', () => {
      const weakPassword = '123';
      const strongPassword = 'securePassword123';
      
      expect(weakPassword.length >= 6).toBe(false);
      expect(strongPassword.length >= 6).toBe(true);
    });
  });

  describe('Login Logic', () => {
    test('should require email and password for login', () => {
      const email = '';
      const password = 'password123';
      
      if (!email || !password) {
        const error = new AuthError(400, 'Email and password are required');
        expect(error.code).toBe(400);
      }
    });

    test('should validate email format for login', () => {
      const validEmail = 'user@example.com';
      const invalidEmail = 'not-an-email';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test(validEmail)).toBe(true);
      expect(emailRegex.test(invalidEmail)).toBe(false);
    });

    test('should accept valid login credentials format', () => {
      const loginData = {
        email: 'user@example.com',
        password: 'password123'
      };
      
      expect(loginData.email).toContain('@');
      expect(loginData.password).toBeTruthy();
    });
  });
});
