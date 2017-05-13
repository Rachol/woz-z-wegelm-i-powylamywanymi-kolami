import { UserData } from './user-common'



function initModel() {
    const mongoose = require('mongoose');

    //User Schema
    const UserSchema = {
        name: {
            type: String
        },
        email: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        scripts: [{
            name: String,
            uploadDate: Number,
            results: []
        }],
        scriptsLimit: {
            type: Number,
            required: true,
            default: 3
        }
    };

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

    static updateUserScripts(username: string, scripts: any, callback: any){
        var query = {'username': username};
        UserModel.model.findOneAndUpdate(query, {scripts: scripts}, {upsert:true}, function(err: any, doc: any){
            if (err) return console.log("ERROR");
        });
    }

}