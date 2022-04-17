import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  /* TODO: implementar validacion con email o dni (metodo de login) */
  validateUser(username: string, password: string) {
    return;
  }
}
