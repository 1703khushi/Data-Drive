import express from "express";
const router = express.Router();
const app = express();
import formidable from "formidable";
import { 
    map_shared_user,
    get_user_bucket,
    get_shared_user,
    get_invites,
    update_invite,
    get_pending_invites
} from '../queries/queries.js'
import { minioClient } from '../minioConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/folder', async (req, res) => {
    /**
     * Gets shared folders and pending invites for a folder
    */
    try{
        let bucketName = await get_user_bucket(req.user.user_email);
        let id = req.query.id
        const shared_users = await get_shared_user(id)
            .then(async (shared) => {
                console.log(shared)
                await get_pending_invites(id)
                    .then(invites => {
                        res.send({
                            error: false,
                            sharedusers: shared,
                            pending: invites,
                            status: 200
                        })
                    })
            })
    }catch(err) {
        console.log(err)
        res.send({
            error: true,
            message: err,
            status: 402
        })
    }
})
router.post('/folder', async (req, res) => {
    /**
     * sents an invite to a user 
    */
    try{
        let bucketName = await get_user_bucket(req.user.user_email);
        let {id, name, users} = req.body
        const inserts = await Promise.all(users.map(async user => {
                return await map_shared_user(
                    id,
                    name,
                    bucketName,
                    user.user,
                    user.Upload,
                    user.Download,
                    user.viewothers
                ).then(ok => {
                    console.log('success')
                    return true
                }).catch(err => {
                    console.log("Share error",err)
                    if(err.errno == 1062){
                        return true
                    }
                    else return false
                })
        }))
        if(inserts.indexOf(false) == -1)
        {
            res.send({
                error: false,
                message: 'Invites send',
                status: 200
            })
        }
        else{
            res.send({
                error: true,
                message: 'Error in sending Invites',
                status: 401
            })
        }
    }catch(err) {
        console.log(err)
        res.send({
            error: true,
            message: err,
            status: 402
        })
    }
})

router.get('/invites', async (req, res) => {
    /**
     * Gets invites of an user
    */
    try{
        let bucketName = await get_user_bucket(req.user.user_email);
        const invites = await get_invites(req.user.user_email)
            .then(shared => {
                console.log(shared)
                res.send({
                    error: false,
                    invites: shared,
                    status: 200
                })
            })
    }catch(err) {
        console.log(err)
        res.send({
            error: true,
            message: err,
            status: 402
        })
    }
})

router.post('/inviteAction', async (req, res) => {
    /**
     * Accepts or rejects an invite
    */
    try{
        const act = req.body.accepted
        const id = req.body.id
        const user = req.user.user_email
        const invites = await update_invite(id, user, act)
            .then(shared => {
                console.log(shared)
                res.send({
                    error: false,
                    act: shared,
                    status: 200
                })
            })
    }catch(err) {
        console.log(err)
        res.send({
            error: true,
            message: err,
            status: 402
        })
    }
})

export default router