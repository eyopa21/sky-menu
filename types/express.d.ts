// types/express.d.ts
import { User } from '../users/user.entity'; // adjust the path to your User entity

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
