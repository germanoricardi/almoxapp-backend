import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Exclude()
  password_hash: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Exclude()
  password_reset_token?: string;

  @IsDate()
  @IsOptional()
  @Exclude()
  password_reset_expires?: Date;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  provider?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Exclude()
  social_id?: string;

  @IsBoolean()
  is_active: boolean;

  @IsDate()
  @IsOptional()
  created_at?: Date;
}
