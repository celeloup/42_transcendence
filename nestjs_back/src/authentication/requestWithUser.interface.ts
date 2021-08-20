import { Request } from 'express';
import User from '../users/user.entity';
 
export default interface RequestWithUser extends Request {
  user: User;
}
