import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @Length(36)
  refresh_token: string;
}
