import express from "express";
const router = express.Router();
const app = express();
import formidable from "formidable";
import { map_user_to_bucket,update_max_storage, get_user_bucket, remove_user_bucket, update_current_storage, admin_get_users } from '../queries/queries.js'
import { minioClient } from '../minioConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/users', async(req, res) => {
    /**
     * get users info
    */
    console.log("Admin Users")
    const data = await admin_get_users()
    console.log(data)
    res.json({data})
})

router.post('/maxstorage', async(req, res) => {
    /**
     * sets max storage of a bucket
    */
    let storage = req.body.newStorage
    let bucket = req.body.bucket
    await update_max_storage(bucket, storage)
        .then(done => {
            console.log(done)
            res.send({
                error: false,
                message: 'Storage Updated'
            })
        }).catch(err => {
            console.log(err)
            res.send({
                error: true,
                message: 'Could not be updated'
            })
        })

})

export default router;