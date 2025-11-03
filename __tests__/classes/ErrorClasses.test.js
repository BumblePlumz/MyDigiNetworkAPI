import { describe, test, expect } from '@jest/globals';
import { UserError } from '../../src/classes/UserError.js';
import { AuthError } from '../../src/classes/AuthError.js';
import { ArticleError } from '../../src/classes/ArticleError.js';
import { CommentError } from '../../src/classes/CommentError.js';
import { MessageError } from '../../src/classes/MessageError.js';
import { RoomError } from '../../src/classes/RoomError.js';
import { SubscriptionError } from '../../src/classes/SubscriptionError.js';

describe('Error Classes', () => {
  describe('UserError', () => {
    test('should create UserError with code and message', () => {
      const error = new UserError(404, 'User not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(404);
      expect(error.message).toBe('User not found');
    });
  });

  describe('AuthError', () => {
    test('should create AuthError with code and message', () => {
      const error = new AuthError(401, 'Unauthorized');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(401);
      expect(error.message).toBe('Unauthorized');
    });
  });

  describe('ArticleError', () => {
    test('should create ArticleError with code and message', () => {
      const error = new ArticleError(404, 'Article not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(404);
      expect(error.message).toBe('Article not found');
    });
  });

  describe('CommentError', () => {
    test('should create CommentError with code and message', () => {
      const error = new CommentError(404, 'Comment not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(404);
      expect(error.message).toBe('Comment not found');
    });
  });

  describe('MessageError', () => {
    test('should create MessageError with code and message', () => {
      const error = new MessageError(404, 'Message not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(404);
      expect(error.message).toBe('Message not found');
    });
  });

  describe('RoomError', () => {
    test('should create RoomError with code and message', () => {
      const error = new RoomError(404, 'Room not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(404);
      expect(error.message).toBe('Room not found');
    });
  });

  describe('SubscriptionError', () => {
    test('should create SubscriptionError with code and message', () => {
      const error = new SubscriptionError(404, 'Subscription not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(404);
      expect(error.message).toBe('Subscription not found');
    });
  });
});
