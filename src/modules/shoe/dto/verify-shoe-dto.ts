import { IsString } from "class-validator";

export class VerifyShoeDTO {
  @IsString()
  modelNumber!: string;
}
