import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { I18nService } from 'nestjs-i18n';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private i18nService: I18nService,
  ) {}

  /**
   * Validates user credentials by checking if the provided username and password
   * match a record in the database.
   *
   * @param email - The email provided by the user
   * @param password - The plain text password provided by the user
   * @returns The user object excluding the password hash, if validation is successful
   * @throws HttpException if the email or password is invalid
   */
  async validateUser(loginDto: LoginDto): Promise<Omit<User, 'password_hash'>> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (
      user &&
      user.password_hash &&
      (await bcrypt.compare(loginDto.password, user.password_hash))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...safeUser } = user;
      return safeUser;
    }

    throw new HttpException(
      this.i18nService.translate('common.modules.auth.invalidCredentials'),
      HttpStatus.UNAUTHORIZED,
    );
  }

  /**
   * Generates access and refresh JWT tokens for the authenticated user.
   *
   * @param user - The user object excluding the password hash
   * @returns An object containing the access_token and refresh_token
   */
  async generateTokens(user: Omit<User, 'password_hash'>) {
    const accessPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(accessPayload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expirationTime'),
    });

    const refreshPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    const refresh_token = new JwtService({
      secret: this.configService.get('jwt.refreshSecret'),
    }).sign(refreshPayload, {
      expiresIn: this.configService.get('jwt.refreshExpirationTime'),
    });

    return { access_token, refresh_token };
  }

  /**
   * Authenticates the user and returns access and refresh tokens.
   *
   * @param user - The user object excluding the password hash
   * @returns An object containing the access_token and refresh_token
   */
  async login(user: Omit<User, 'password_hash'>) {
    return await this.generateTokens(user);
  }

  /**
   * Validates the provided refresh token and generates new tokens.
   *
   * @param refreshToken - The refresh token provided by the client
   * @returns An object containing new access_token and refresh_token
   * @throws HttpException if the token is expired, invalid, or the user is not found
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload: { sub: string; name: string; email: string } =
        await new JwtService({
          secret: this.configService.get('jwt.refreshSecret'),
        }).verifyAsync(refreshTokenDto.refresh_token);

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new HttpException(
          this.i18nService.translate('common.modules.auth.userNotIdentified'),
          HttpStatus.UNAUTHORIZED,
        );
      }
      return this.generateTokens(user);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = (error as { message?: string }).message;
        switch (message) {
          case 'jwt expired':
            throw new HttpException(
              this.i18nService.translate('common.modules.auth.tokenExpired'),
              HttpStatus.UNAUTHORIZED,
            );
            break;

          default:
            throw new HttpException(
              message ?? 'Unauthorized',
              HttpStatus.UNAUTHORIZED,
            );
            break;
        }
      } else {
        throw new HttpException('Unknown error', HttpStatus.UNAUTHORIZED);
      }
    }
  }

  /**
   * Handles password reset requests by generating a reset token and sending an email with the reset link.
   *
   * @param email - The email address of the user requesting the password reset.
   * @throws HttpException - If the user is not found in the database.
   */
  async requestPasswordReset(
    requestPasswordResetDto: RequestPasswordResetDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: requestPasswordResetDto.email },
    });

    if (!user) {
      throw new HttpException(
        this.i18nService.translate('common.modules.auth.userNotFound'),
        HttpStatus.NOT_FOUND,
      );
    }

    const token = crypto.randomUUID();
    const expiration = new Date();
    expiration.setHours(
      expiration.getHours() +
        Number(this.configService.get('passwordReset.expirationHour')),
    );

    user.password_reset_token = token;
    user.password_reset_expires = expiration;
    await this.userRepository.save(user);

    const resetUrl = `${this.configService.get('passwordReset.url')}?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: this.configService.get('email.host'),
      port: this.configService.get('email.port'),
      secure: this.configService.get('email.secure'),
      auth: {
        user: this.configService.get('email.auth.user'),
        pass: this.configService.get('email.auth.pass'),
      },
    });

    await transporter.sendMail({
      from: this.configService.get('email.from'),
      to: user.email,
      subject: this.i18nService.translate(
        'common.modules.auth.requestPasswordEmailStructure.subject',
      ),
      text: this.i18nService.translate(
        'common.modules.auth.requestPasswordEmailStructure.text',
        {
          args: { resetUrl },
        },
      ),
      html: this.i18nService.translate(
        'common.modules.auth.requestPasswordEmailStructure.html',
        {
          args: { resetUrl },
        },
      ),
    });
  }

  /**
   * Resets the user's password using a valid token and a new password.
   *
   * @param password - The new password to set.
   * @param token - The token received by email to authorize the password reset.
   * @throws HttpException - If the token is invalid or has expired.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { password_reset_token: resetPasswordDto.token },
    });

    if (
      !user ||
      !user.password_reset_expires ||
      user.password_reset_expires < new Date()
    ) {
      throw new HttpException(
        this.i18nService.translate('common.modules.auth.invalidOrExpiredToken'),
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password_hash = await bcrypt.hash(resetPasswordDto.password, 10);
    user.password_reset_token = null as unknown as undefined;
    user.password_reset_expires = null as unknown as undefined;

    await this.userRepository.save(user);
  }

  /**
   * Returns the authenticated user's information.
   *
   * @param id - The user's ID
   * @returns The user object if found, otherwise undefined
   */
  async me(id: UUID) {
    return await this.userRepository.findOneBy({ id });
  }
}
