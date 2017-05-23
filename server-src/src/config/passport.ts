import { DatabaseConfig } from './database';
import { UserModel } from '../models/user';
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = "E:/Programming/BattleIsland/storage/Databases/96529230ba69f6ed1ef0770a494441cd.sqlite"

function updateScriptData (username: string, scriptName:string, callback: any) {
    var db = new sqlite3.Database(DB_PATH);

    let script = username + "\\" + scriptName;
    if (script.startsWith("\\")) {
        script = script.slice(1);
    }
    let scriptData = {
        games: 0,
        wins: 0
    }

    db.get("SELECT games, wins FROM Results WHERE script=?", [script], function(err: any, row: any) {
        if(row){
            scriptData.games = row.games;
            scriptData.wins = row.wins;
        }
        callback(scriptData)
    });

    db.close();
}

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
                    if(user.scripts.length > 0 ){
                        for(let i = 0; i < user.scripts.length; i++) {
                            updateScriptData(user.username, user.scripts[i].name, (scriptData: any) => {
                                user.scripts[i].games = scriptData.games;
                                user.scripts[i].wins = scriptData.wins;
                                if(i == user.scripts.length - 1){
                                    UserModel.updateUserScripts(user.username, user.scripts, null);
                                    return done(null, user);
                                }
                            });

                        }
                    } else {
                        return done(null, user);
                    }

                } else {
                    return done(null, false);
                }
            })
        }))
    }

}

