import express from "express";
const router = express.Router();
const app = express();
import formidable from "formidable";
import { map_user_to_bucket, get_user_bucket, remove_user_bucket, update_current_storage, admin_get_users } from '../queries/queries.js'
import { minioClient } from '../minioConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/link', async (req, res) => {
    /**
     * gets url for a file and sends it to the client
    */
    console.log('linksss')
    let folder = req.query.parent
    let fileName = req.query.file
    if(folder == '') folder = '0'
    let bucketName = await get_user_bucket(req.user.user_email); // get this from database (sql)
    if(bucketName == undefined){
        res.send({
            error: true,
            status: 402,
            message: "BucketName doesnt Exist"
        })
        return;
    }
    const link = await minioClient.presignedGetObject(bucketName, `${folder}/${fileName}`, 60*60)
    res.send({
        error: false,
        link: link
    })

})

router.get('/mysharelink', async (req, res) => {
    /**
     * gets link of a shared file
    */
    if(req.query.Download == 0)
    {
        res.send({
            error: true,
            message: "Unauthorized to Download"
        })
        return
    }
    let folder = req.query.parent
    if(folder == '') folder = '0'
    let fileName = req.query.file
    let uploader = req.query.creater
    let bucketName = req.query.creater_bucket
    if(bucketName == undefined){
        res.send({
            error: true,
            message: "BucketName doesnt Exist"
        })
        return;
    }
    if(uploader == '')
    {
        fileName = `${folder}/${fileName}`
    }
    else{
        fileName = `${folder}/${uploader}|${fileName}`
    }
    const link = await minioClient.presignedGetObject(bucketName, fileName, 60*60)
    res.send({
        error: false,
        link: link
    })

}) 

export default router