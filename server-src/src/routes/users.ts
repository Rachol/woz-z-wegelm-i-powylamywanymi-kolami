const passport = require('passport');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

import * as Express from 'express';

interface UserRegisterData {
    name: string;
    email: string;
    username: string;
    password: string;
}

interface UserAuthenticateData {
    username: string;
    password: string;
}

class UserResponseAPI {
    json(parameter: object) {}
};

export class UserService{

    private router: Express.Router;

    constructor(){
        this.router = Express.Router();
        this.initUserRoutes();
    }

    getRouter(): Express.Router {
        return this.router;
    }

    initUserRoutes() {
        // Register
        this.router.post('/register', (req: any, res: any, next: any) => {
            this.postRegister(req.body, res);
        })

        // Authenticate
        this.router.post('/authenticate', (req: any, res: any, next: any) => {
            this.postAuthenticate(req.body, res);
        })

        // Profile
        this.router.get('/profile', passport.authenticate('jwt', {session: false}), (req: any, res: any, next: any) => {
            let retVal = this.getProfile(res);
            // This is a special case, where req is modified by passport function and the actual request does not contain
            // any parameters.
            retVal.user = req.user;
            res.json(retVal);
        })
    }

    postRegister(userData: UserRegisterData, res: UserResponseAPI) {
        let newUser = new User(userData);
        User.addUser(newUser, (err: any, user: any) => {
            if(err){
                res.json({
                    success: false,
                    msg: 'Failed to register user'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'User registered'
                });
            }
        })
    }

    postAuthenticate(userData: UserAuthenticateData, res: UserResponseAPI) {
        User.getUserByUsername(userData.username, (err: any, user: any) => {
            if(err) throw err;
            if(!user){
                return res.json({
                    success: false,
                    msg: 'User not found'
                });
            }

            User.comparePassword(userData.password, user.password, (err: any, isMatch: boolean) => {
                if(err) throw err;
                if(isMatch){
                    const token = jwt.sign(user, config.secret, {
                        expiresIn: 604800 //1 week
                    });
                    res.json({
                        success: true,
                        token: 'JWT ' + token,
                        user: {
                            id: user._id,
                            name: user.name,
                            username: user.username,
                            email: user.email
                        }
                    });
                } else {
                    return res.json({
                        success: false,
                        msg: 'Wrong password'
                    });
                }
            })
        })
    }

    getProfile(res: UserResponseAPI) {
        return {
            user: null
        };
    }
}
