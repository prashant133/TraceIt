import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDTO {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
