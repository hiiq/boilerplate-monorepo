import { Request, Response } from 'express';

interface Context {
  req: Request;
  res: Response;
  payload?: { id: string; email: string };
}

export { Context };
