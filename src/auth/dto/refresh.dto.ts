import { IsNotEmpty, IsString } from "class-validator";

export default class RefreshTokenDto{
    @IsString()
    @IsNotEmpty()
    refreshToken: string
}