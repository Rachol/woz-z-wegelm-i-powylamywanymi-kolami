import * as Express from 'express';
import { UserModel } from '../models/user';
let fs = require('fs');

const DIR = '../../uploads/';


export class FileRoutes {
    private multer = require('multer');
    private path = require('path');

    private upload: any

    private router: Express.Router;

    constructor(){
        this.router = Express.Router();
        const FINAL_DIR = this.path.join(__dirname, DIR);

        let storage = this.multer.diskStorage({
            destination: function (req: any, file: any, cb: any) {

                const folderName = FINAL_DIR + req.body.username;
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
        this.router.post('/upload', (req: any, res: any, next: any) => {
            this.postUpload(req, res);
        })
    }

    postUpload(req: any, res: any): any {
        this.upload(req, res, function (err: any) {
            if (err) {
                return res.json(err.toString());
            }
            //file has been uploaded, time to update the data
            UserModel.getUserByUsername(req.body.username, (err: any, user: any) => {
                if(err) throw err;
                if(!user){
                    return res.json({
                        success: false,
                        msg: 'User not found'
                    });
                }

                //check if the file already existed for this user
                let newScript = {
                    'name': req.body.finalName,
                    'uploadDate': req.body.uploadTime,
                    'results': []
                }

                let scripts: any;
                scripts = [];
                let replaced = false;
                for (let entry of user.scripts) {
                    if(!replaced && entry.name == req.body.scriptName) {
                        scripts.push(newScript)
                        replaced = true;
                    }else{
                        scripts.push(entry)
                    }
                }
                if(!replaced){
                    scripts.push(newScript)
                    let limit = user.scriptsLimit ? user.scriptsLimit : 3
                    if(scripts.length > limit){
                        scripts = scripts.slice(1);
                    }
                }

                UserModel.updateUserScripts(req.body.username, scripts, null);
            })
            res.end('File is uploaded');
        });
    }
}
