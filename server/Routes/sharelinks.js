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
    get_folder_info
} from '../queries/queries.js'
import { minioClient } from '../minioConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/files', async (req,res) => {
    try{
        let parent = req.query.parent
        let file = req.query.file
        if(parent == '') parent = '0'
        console.log(parent)
        let folder_info = await get_folder_info(parent)
        console.log(folder_info)
        let bucket= folder_info[0].bucket_name

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
            console.log('Listing objects completed.');

            res.json({ 
                objects: file != 'folder'?objects.filter(obj => obj.name.includes(`${file}`)):objects,
                folder_info: folder_info[0]
            });
        })
    }catch(err) {
        console.log(err)
        res.send({err, status: 402})
    }
})

export default router