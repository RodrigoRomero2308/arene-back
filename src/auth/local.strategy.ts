import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private authService: AuthService) {
    super({
      usernameField: 'dniOrEmail',
    });
  }

  async validate(dniOrEmail: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(dniOrEmail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
