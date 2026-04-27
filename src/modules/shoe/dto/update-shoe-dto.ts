import { IsOptional, IsString, Matches } from "class-validator";

export class UpdateShoeDTO {
  @IsOptional()
  @IsString()
  brand!: string;

  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @Matches(/^\d{4}\/\d{2}\/\d{2}$/, {
    message: "manufactureAt must be in format YYYY/MM/DD",
  })
  manufactureAt!: string;
}
