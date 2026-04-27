import { IsString, Matches } from "class-validator";

export class CreateShoeDTO {
  @IsString()
  modelNumber!: string;

  @IsString()
  brand!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @Matches(/^\d{4}\/\d{2}\/\d{2}$/, {
    message: "manufactureAt must be in format YYYY/MM/DD",
  })
  manufactureAt!: string;
}
