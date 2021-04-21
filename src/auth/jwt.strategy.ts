import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User, UserDocument } from 'src/user/user.schema';
import { JwTPayload } from 'src/auth/jwt-payload.interface';
import * as config from 'config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret')
        });
    }

    /**
     * Authenticates a user who tries to log in via email.
     *
     * @param {JwTPayload} payload - Credentials.
     * @returns {Promise<User>} - User object if the authentication was successful.
     * @throws {UnauthorizedException} - If the authentication was not successful.
     */
    public async validate(payload: JwTPayload): Promise<User> {
        const { email } = payload;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException();
        }
        const { _id, ...userCopy } = user['_doc'];
        userCopy.id = _id;
        return userCopy;
    }
}
