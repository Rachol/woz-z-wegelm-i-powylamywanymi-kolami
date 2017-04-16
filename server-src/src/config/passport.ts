import { DatabaseConfig } from './database';
import { UserModel } from '../models/user';

export class PassportConfig {

    static configure(passport: any) {
        const jwtStrategy = require('passport-jwt').Strategy;
        const extractJwt = require('passport-jwt').ExtractJwt;

        let opts = {
            jwtFromRequest: extractJwt.fromAuthHeader(),
            secretOrKey: DatabaseConfig.secret
        };

        passport.use(new jwtStrategy(opts, (jwt_payload: any, done: any) => {
            UserModel.getUserById(jwt_payload._doc._id, (err: any, user: any) => {
                if (err) {
                    return done(err, false);
                }

                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
        }))
    }

}

