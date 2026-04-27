import { IsEmail, IsString, IsNotEmpty, MinLength } from "class-validator";

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}
