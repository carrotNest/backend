import { IsNotEmptyAndString } from "src/decorators/is-Not-Empty-And-String.decorator";

export class RefreshTokenDto{

    @IsNotEmptyAndString()
    refreshToken: string;
}