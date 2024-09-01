import express from "express";
const router = express.Router();
const app = express();
import formidable from "formidable";
import { map_user_to_bucket, get_user_bucket, remove_user_bucket,
    update_current_storage,
    insert_new_folder,
    get_child_folders,
    get_bucket_info,
    decrease_current_storage
} from '../queries/queries.js'
import { minioClient } from '../minioConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createNewBucket = async (email,req,res) => {
    let shortEmail ='';
    for (let i = 0; i < email.length; i++) {
        const charCode = email.charCodeAt(i);   
        if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
        shortEmail += email.charAt(i);
        }
    }
    return await new Promise((resolve, reject) => {
        minioClient.makeBucket(shortEmail,async (err) =>{
            if(err){
                console.error('Error creating bucket:', err.code);
                const new_bucket = await map_user_to_bucket(req.user.user_email,shortEmail)
                resolve("done")
            } else{
                const new_bucket = await map_user_to_bucket(req.user.user_email,shortEmail)
                console.log('Bucket created successfully.');
                resolve("done")
            }
        })
    }).then(done => {
        return shortEmail
    }).catch(err => {
        console.log(err.message);
        return "error"
    })
}
const checkExists = async (bucketName) => {
    return new Promise((resolve, reject) => {
        minioClient.bucketExists(bucketName, (err, exists) => {
            if(err){
                console.log("Error: bucketExists error");
                reject(err)
            }
            if(exists){
                console.log("bucket Exists")
                resolve(exists)
            }
            else{
                console.log('Bucket doesnt exist')
                resolve(exists)
            }
        })
    })
}
const checkBucket = async (bucketName, req, res) => {
    let bucket = bucketName
    return await checkExists(bucketName)
        .then(async exist => {
            console.log("Exist",exist)
            if(exist){
               return bucket
            }else{
                console.log("here")
                bucket = await createNewBucket(req.user.user_email, req, res)
                console.log("bucket", bucket)
                return bucket
            }
        }).catch(err => {
            console.log(err.message);
            return "error"
        })
   
}

router.get("/",async (req,res) => {
    /**
     * Gets files for a folder from MinIO
    */
    try{
        let parent = req.query.parent
        if(parent == '') parent = '0'
        const parent_name = req.query.parent_name
        console.log(parent)
        let bucketName = await get_user_bucket(req.user.user_email); // get this from database (sql)
        if(bucketName == undefined){
            bucketName = "nobucket";
        }
            await checkBucket(bucketName, req,res)
                .then(bucket => {
                    console.log("hohoho",bucket)
                    const objects = [];
                    const stream = minioClient.listObjects(bucket, parent, true);
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
                    let info = await get_bucket_info(bucket)
                    console.log('Listing objects completed.');
                    let child = await get_child_folders(bucket, parent_name)
                    console.log(child)
                    res.json({ 
                        objects, 
                        CurrentStorage: info.current_storage, 
                        MaxStorage: info.max_storage,
                        childFolders: child
                    });
                    });
                }).catch(err => {
                    console.log("checkBucket error: ",err)
                })
    } catch(err){
        console.log(err.message);
        res.send({err, status: 402})
    }
    
});

router.post("/",async function(req,res){
    /**
     * Uploads files in a folder to MinIO
    */
    try{
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
                let bucketName = await get_user_bucket(req.user.user_email); // get this from database (sql)
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
     * Deletes an object from a specified MinIO path
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
     * Creates a new Folder
    */
    try{
        const folder = req.body.name
        const parent = req.body.parent
        console.log(folder, parent)
        let bucketName = await get_user_bucket(req.user.user_email); // get this from database (sql)
        if(bucketName == undefined){
            bucketName = "nobucket";
        }
        await checkBucket(bucketName, req,res)
            .then(async bucket => {
                console.log("hohoho",bucket)
                const new_folder = await insert_new_folder(req.user.user_email, bucket,folder, parent)
                console.log(new_folder)
                res.send({
                    error: false,
                    status: 200,
                })
            }).catch(err => {
                console.log("checkBucket error: ",err)
            })
    }catch(err) {
        console.log(err.message)
        res.send({error: true, message: err, status: 201})
    }
})

export default router;