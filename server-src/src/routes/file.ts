import * as Express from 'express';
import { UserModel } from '../models/user';
let fs = require('fs');
let path = require('path');

const DIR = '../../../../uploads/';
const FINAL_DIR = path.join(__dirname, DIR);

const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, "../../../../database/results.db");

function clearScriptData (username: string, scriptName:string) {
    var db = new sqlite3.Database(DB_PATH);

    let script = username + "\\" + scriptName;
    if (script.startsWith("\\")) {
        script = script.slice(1);
    }

    db.run("DELETE FROM Results WHERE script=?", script);

    db.close();
}



function getAllData (callback: any) {
    var db = new sqlite3.Database(DB_PATH);

    db.all("SELECT * FROM Results", function(err: any, rows: any) {
        callback(rows)
    });

    db.close();
}

export class FileRoutes {
    private multer = require('multer');
    private passport = require('passport');
    private jwt = require('jsonwebtoken');

    private upload: any

    private router: Express.Router;

    constructor(){
        this.router = Express.Router();

        let storage = this.multer.diskStorage({
            destination: function (req: any, file: any, cb: any) {

                const folderName = FINAL_DIR + req.user.username;
                if (!fs.existsSync(folderName)){
                    fs.mkdirSync(folderName);
                }
                cb(null, folderName);
            },
            filename: function (req: any, file: any, cb: any) {
                const finalName = file.originalname;
                req.body['finalName'] = finalName;
                cb(null, finalName);
            }
        })

        this.upload = this.multer({
            storage: storage
        }).any();

        this.initFileRoutes();
    }

    getRouter(): Express.Router {
        return this.router;
    }

    initFileRoutes() {
        // Upload
        this.router.post('/upload', this.passport.authenticate('jwt', {session: false}), (req: any, res: any, next: any) => {
            console.log("cry not")
            this.postUpload(req, res);
        })
        // Upload
        this.router.get('/stats', (req: any, res: any, next: any) => {
            // This is a special case, where req is modified by passport function and the actual request does not contain
            // any parameters.
            console.log("cry")
            this.getStats(res);
        })
    }

    getStats(res: any): any {
        getAllData((data: any) => {
            res.json(data);
        })
    }


    postUpload(req: any, res: any): any {
        let user = req.user
        if (!user || !user.username) {
            return res.json({
                success: false,
                msg: 'User not found'
            });
        }
        this.upload(req, res, function (err: any) {
            if (err) {
                return res.json(err.toString());
            }
            //file has been uploaded, time to update the data
            //check if the file already existed for this user
            let newScript = {
                'name': req.body.finalName,
                'uploadDate': req.body.uploadTime,
                'games': 0,
                'wins': 0
            }

            let scripts: any;
            scripts = [];
            let replaced = false;
            let fileToRemove = "";
            for (let entry of user.scripts) {
                if (!replaced && entry.name == req.body.scriptName) {
                    scripts.push(newScript)
                    replaced = true;
                    if (entry.name != req.body.finalName) {
                        fileToRemove = entry.name;
                    }
                } else {
                    scripts.push(entry)
                }
            }
            if (!replaced) {
                scripts.push(newScript)
                let limit = user.scriptsLimit ? user.scriptsLimit : 3
                if (scripts.length > limit) {
                    fileToRemove = scripts[0].name;
                    scripts = scripts.slice(1);
                }
            }

            let pathToRemove = path.join(FINAL_DIR + user.username, fileToRemove);
            if (fileToRemove != "" && fs.existsSync(pathToRemove)) {
                fs.unlink(pathToRemove);
            }

            //remove entry from sql database
            clearScriptData(user.username, fileToRemove);

            UserModel.updateUserScripts(user.username, scripts, null);
            res.end('File is uploaded');
        });
    }
}
