import request from 'supertest';
import { User } from '../services/auth-service/src/models/user.model';
import { app } from '../src/app';
import bcrypt from 'bcryptjs';

// Mock Sequelize User model
jest.mock('../src/models/user.model', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Auth Controller', () => {
  describe('POST /auth/signup', () => {
    it('should return 201 when the user is successfully created', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null); // Simulate no existing user
      (User.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      });

      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
    });

    it('should return 400 if the email already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' }); // Simulate existing user

      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should return 200 with a token on successful login', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10), // Mock hashed password
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
    });

    it('should return 400 if the user is not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null); // Simulate no user found

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 400 if the password is incorrect', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10), // Mock correct password
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
