import { User } from '../user.entity';

export interface UserRegisterDto {
  username: User['username'];
  password: string;
}
