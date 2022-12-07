import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashService } from '@/hash/hash.service';
import { UsersService } from '@/users/users.service';
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
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const isPasswordValid = await this.hashService.compareHash(
      password,
      user.password,
    );

    if (isPasswordValid) {
      return user;
    }

    throw new UnauthorizedException('Usuario o contraseña incorrectos');
  }
}
