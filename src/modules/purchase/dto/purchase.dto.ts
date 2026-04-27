import { IsString } from "class-validator";

export class PurchaseShoeDTO {
  @IsString()
  modelNumber!: string;
}
