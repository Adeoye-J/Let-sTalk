import { z } from 'zod';

const nameSchema = z
.string()
.min(1, { message: 'Name is required' })
.min(2, { message: 'Name must be at least 2 characters long' })
.max(100, { message: 'Name must not exceed 100 characters' });

const usernameSchema = z
.string()
.min(2, { message: 'Username must be at least 2 characters long' })
.max(50, { message: 'Username must not exceed 50 characters' });

const emailSchema = z
.string()
.email({ message: 'Invalid email address' })
.min(1, { message: 'Email is required' });

const passwordSchema = z
.string()
.min(8, { message: 'Password must be at least 8 characters long' })
.max(128, { message: 'Password must not exceed 128 characters' });

export const signUpSchema = z.object({
    name: nameSchema,
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});