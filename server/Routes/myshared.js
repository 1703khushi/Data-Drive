import express from "express";
const router = express.Router();
const app = express();
import formidable from "formidable";
import { map_user_to_bucket, get_user_bucket, remove_user_bucket,
    update_current_storage,
    insert_new_folder,
    get_child_folders,
    get_bucket_info,
    decrease_current_storage,
    get_user_accepted,
    get_folder_users,
    get_folder_admin
} from '../queries/queries.js'
import { minioClient } from '../minioConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);   

router.get("/files",async (req,res) => {
    /**
     * Gets files for a shared folder from MinIO
    */
    try{
        let parent = req.query.parent
        const parent_name = req.query.parent_name
        const creater = req.query.creater
        if(parent == ''){
            const accepted = await get_user_accepted(req.user.user_email)
            res.send({
                error: false,
                accepted: accepted,
                objects: [],
                status: 200
            })
        }
        else{
            const objects = [];
            const stream = minioClient.listObjects(creater, parent, true);
            console.log("stream collected");
            stream.on('data', (obj) => {
            objects.push(obj);
            });
        
            stream.on('error', (err) => {
            console.error('Error listing objects:', err);
            res.status(500).json({ error: 'Failed to list objects' });
            });
        
            stream.on('end', async () => {
            console.log(objects)
            console.log('Listing objects completed.');
            let child = await get_child_folders(creater, parent_name)
            console.log(child)
            res.send({ 
                error: false,
                objects,
                accepted: child,
                status: 200
            });
            });
        }
    } catch(err){
        console.log(err.message);
        res.send({
            error: true,
            objects: [],
            accepted: [],
            message: err
        })
    }
    
});

router.post("/",async function(req,res){
    /**
     * Uploads a file to a shared folder
    */
    try{
        if(req.query.Upload == 0)
        {
            res.send({
                error: true,
                message: "Unauthorized to Upload",
            })
            return 
        }
        const form = formidable({multiples: true});
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(400).json({ error: "Failed to parse form data" });
                return;
            }
            console.log(files.files.length)
            const result = await Promise.all(files.files.map(async (file) => {
                let size = file.size
                let filePath  = file.filepath;
                let folder = req.query.parent
                if(folder == '') folder = '0'
                let bucketName = req.query.creater
                if(bucketName == undefined){
                    return {
                        error: true,
                        message: "BucketName doesnt Exist"
                    };
                }
                let fileName = file.originalFilename;
                return await new Promise((resolve, reject) => {
                    minioClient.fPutObject(bucketName, `${folder}/${fileName}`, filePath, async (err, objInfo) => {
                        if(err) {
                            reject(err)
                            return
                        }
                        let info = await update_current_storage(bucketName, size)
                        console.log("Success")
                        resolve(objInfo)
                    })
                }).then(objInfo => {
                    return ({
                        error: false,
                        status: 200,
                        data: objInfo,
                        fileName: fileName
                    })
                }).catch(err => {
                    console.log("error",err)
                    return ({
                        error: true,
                        status: 400,
                        message: "Failed to upload"
                    })
                })
                
            }))
            res.send({
                error: false,
                status: 200,
                message: 'All uploaded'
            })
        })
    } catch(err){
        console.log(err.message);
        res.send({err})
    }
});

router.post('/removeObject', async (req, res) => {
    /**
     * deletes an object from a shared folder
    */
    try {
        let folder = req.body.parent
        let fileName = req.body.file
        let size = req.body.size
        if(folder == '') folder = '0'
        let bucketName = await get_user_bucket(req.user.user_email); // get this from database (sql)
        if(bucketName == undefined){
            res.send({
                error: true,
                message: "BucketName doesnt Exist"
            })
            return;
        }

        await minioClient.removeObject(bucketName, `${folder}/${fileName}`)
            .then(async ok => {
                await decrease_current_storage(bucketName, size)
                console.log('Removed the object');
                res.send({
                    error: false,
                    message: 'Deleted'
                })
            }).catch(err => {
                res.status(400).json({error:"Failed to Delete"})
                return
            })

    }catch(err) {
        console.log(err)
        res.send({err})
    }

})

router.post('/newFolder', async (req, res) => {
    /**
     * Creates a new folder within a shared folder
    */
    try{
        if(req.body.Upload == 0)
        {
            res.send({
                error: true,
                message: "Unauthorized to Upload",
            })
            return 
        }
        const folder = req.body.name
        const parent = req.body.parent
        const bucketName = req.body.creater
        if(bucketName == undefined){
            res.send({
                error: true,
                message: "BucketName doesnt Exist"
            })
            return;
        }
        const new_folder = await insert_new_folder(req.user.user_email, bucketName,folder, parent)
        console.log(new_folder)
        res.send({
            error: false,
            status: 200,
        })
    }catch(err) {
        console.log(err.message)
        res.send({error: true, message: err, status: 201})
    }
})

router.get('/users', async (req, res) => {
    try{
        if(req.query.viewothers == 0)
        {
            res.send({
                error: true,
                message: "Unauthorized to View users",
            })
            return
        }
        const id = req.query.id
        console.log(id)
        const users = await get_folder_users(id)
        const moderator = await get_folder_admin(id)
        console.log(users, moderator)
        res.send({
            error: false,
            users: users,
            moderator: moderator[0].user
        })
    }catch(err) {
        console.log(err.message)
        res.send({error: true, message: err, status: 201})
    }
})

export default router;