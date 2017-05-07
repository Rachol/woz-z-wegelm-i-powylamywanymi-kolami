import { UserData, UserSchema } from './user-common'
import {isUndefined} from "util";

function initModel() {
    const mongoose = require('mongoose');
    return mongoose.model('User', mongoose.Schema(UserSchema));
}

export class UserModel {
    private static bcrypt = require('bcryptjs');
    private static model = initModel();

    static create(userData: UserData){
        return new UserModel.model(userData);
    }

    static getUserById(id: string, callback: any) {
        UserModel.model.findById(id, callback);
    }

    static getUserByUsername(username: string, callback: any) {
        const query = {username: username};
        UserModel.model.findOne(query, callback);
    }

    static addUser(newUser: any, callback: any) {
        UserModel.bcrypt.genSalt(10, (err: any, salt: string) => {
            UserModel.bcrypt.hash(newUser.password, salt, (err: any, hash: string) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save(callback);
            })
        })
    };

    static comparePassword(candidatePassword: string, hash: string, callback: any) {
        UserModel.bcrypt.compare(candidatePassword, hash, (err: any, isMatch: boolean) => {
            if (err) throw err;
            callback(null, isMatch);
        })
    };

    static isUserNameRegistered(username: string, callback:(isRegistered: boolean) => void){
        const query = {username: username};
        UserModel.model.findOne(query, (err: any, user: any) => {
            if (err) throw err;
            if(user){
                callback(true);
            }else{
                callback(false);
            }
        });
    }
}