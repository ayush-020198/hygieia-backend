import { Result, ValidationError } from 'express-validator';
import { Request } from 'express';
export interface APIResponse {
  error?: string;
  errors?: Result<ValidationError>;
  message?: string;
}

export interface JWTPayload {
  email: string;
}

export type AuthRequest = Request & {
  email: string;
};
