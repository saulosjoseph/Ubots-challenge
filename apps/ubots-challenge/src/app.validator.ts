import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class NewSolicitation {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}

