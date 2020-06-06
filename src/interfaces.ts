import { Result, ValidationError } from 'express-validator';
export interface APIResponse {
  error?: string;
  errors?: Result<ValidationError>;
  message?: string;
}
