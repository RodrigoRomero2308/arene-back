import { Injectable } from '@nestjs/common';
import { HashService } from 'src/hash/hash.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(dniOrEmail: string, password: string) {
    const user = await this.userService.findOne({
      OR: [
        {
          dni: dniOrEmail,
        },
        {
          email: dniOrEmail,
        },
      ],
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.hashService.compareHash(
      password,
      user.password,
    );

    if (isPasswordValid) {
      return user;
    }

    return null;
  }
}
