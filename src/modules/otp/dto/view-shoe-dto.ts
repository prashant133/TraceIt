import { IsString, Length } from "class-validator";

export class ViewShoeDTO {
  @IsString()
  @Length(4, 4)
  code!: string;
}
