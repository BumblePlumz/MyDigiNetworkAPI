import { describe, test, expect } from '@jest/globals';
import bcrypt from 'bcrypt';

describe('Utils - Bcrypt Functions', () => {
  describe('bcrypt.hash', () => {
    test('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });
  });

  describe('bcrypt.compare', () => {
    test('should return true for matching password and hash', async () => {
      const password = 'testPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hashedPassword);
      
      expect(isMatch).toBe(true);
    });

    test('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(wrongPassword, hashedPassword);
      
      expect(isMatch).toBe(false);
    });
  });
});
