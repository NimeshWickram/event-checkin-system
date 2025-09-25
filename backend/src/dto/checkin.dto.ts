import { IsString, IsNotEmpty } from 'class-validator';

export class CheckInDto {
  @IsString()
  @IsNotEmpty()
  referenceNumber: string;
}