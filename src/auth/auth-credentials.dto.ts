import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

const PASSWORD_REGEXP = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
const PASSWORD_ERROR = 'Password too weak';
const PASSWORD_MIN_LENGTH = 8;
const MAX_LENGTH = 20;

export class AuthCredentialsDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    @MaxLength(MAX_LENGTH)
    @Matches(PASSWORD_REGEXP, { message: PASSWORD_ERROR })
    password: string;
}
