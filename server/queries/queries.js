import express from 'express'
import {execSql}  from '../db.js'
import { v4 as uuidv4 } from 'uuid';

const map_user_to_bucket = async (user,bucket) => {
    let query = `INSERT INTO User_Bucket VALUES ('${user}','${bucket}');`
    const res = await execSql(query)
    const res2 = await create_bucket_info(user,bucket)
    return res
}
const create_bucket_info = async (user,bucket) => {
    let query = `INSERT INTO Bucket_info VALUES ('${user}', '${bucket}', DEFAULT, DEFAULT);`
    return await execSql(query)
}
const get_user_bucket = async (user) => {
    let query = `SELECT bucket_name FROM User_Bucket where user = '${user}';`
    return await execSql(query).then(res => res[0]?.bucket_name)
}
const remove_user_bucket = async (user) => {
    let query = `DELETE FROM User_Bucket where user = '${user}';`
    return await execSql(query)
}
const update_current_storage = async (bucket, storage) => {
    let query = `UPDATE Bucket_info set current_storage = current_storage + ${storage} where bucket_name = '${bucket}';`
    return await execSql(query)
}
const update_max_storage = async (bucket, storage) => {
    let query = `UPDATE Bucket_info set max_storage = ${storage*1000} where bucket_name = '${bucket}';`
    return await execSql(query)
}
const decrease_current_storage = async (bucket, storage) => {
    let query = `UPDATE Bucket_info set current_storage = current_storage - ${storage} where bucket_name = '${bucket}';`
    return await execSql(query)
}

const get_bucket_info = async (bucket) => {
    let query = `SELECT current_storage, max_storage from Bucket_info where bucket_name = '${bucket}';`
    return await execSql(query).then(res => res[0])
}

const admin_get_users = async () => {
    let query = 'SELECT * from Bucket_info'
    return await execSql(query)
}

const insert_new_folder = async (user, bucket, folder, parent) => {
    let id = uuidv4()
    let query = `INSERT INTO file_graph VALUES ('${user}','${bucket}', '${id}', '${folder}', '${parent}', DEFAULT);`
    return await execSql(query)
}

const get_child_folders = async (bucket, parent) => {
    let query = `SELECT id, folder from file_graph where bucket_name = '${bucket}' and parent_folder = '${parent}';`
    return await execSql(query)
}

const map_shared_user = async (id, folder, creater, user, upload, download, others) => {
    let query = `INSERT INTO shared_folder VALUES ('${id}','${folder}','${creater}','${user}',${upload},${download},${others}, DEFAULT);`
    return await execSql(query)
}

const get_shared_user = async (id) => {
    let query = `SELECT * from shared_folder where id='${id}' and accepted = 1;`
    return await execSql(query)
}
const get_pending_invites = async (id) => {
    let query = `SELECT * from shared_folder where id='${id}' and accepted = 0;`
    return await execSql(query)
}
const get_invites = async (user) => {
    let query = `SELECT * from shared_folder where user = '${user}' and accepted = 0;`
    return await execSql(query)
}
const get_user_accepted = async (user) => {
    let query = `SELECT * from shared_folder where user='${user}' and accepted = 1;`
    return await execSql(query)
}
const get_folder_users = async (id) => {
    let query = `SELECT * from shared_folder where id='${id}' and accepted = 1;`
    return await execSql(query)
}
const get_folder_admin = async(id) => {
    let query = `SELECT user from file_graph where id='${id}';`
    return await execSql(query)
}

const get_folder_info = async(id) => {
    let query = `SELECT * from file_graph where id='${id}';`
    return await execSql(query)
}
const update_invite = async (id, user, act) => {
    if(act == 0)
    {
        let query = `DELETE from shared_folder where id='${id}' and user='${user}';`
        return await execSql(query)
    }
    else{
        let query = `UPDATE shared_folder set accepted = 1 WHERE id='${id}' and user='${user}';`
        return await execSql(query)
    }
}
export {
    map_user_to_bucket,
    get_user_bucket,
    remove_user_bucket,
    update_current_storage,
    update_max_storage,
    admin_get_users,
    insert_new_folder,
    get_child_folders,
    get_bucket_info,
    decrease_current_storage,
    map_shared_user,
    get_pending_invites,
    get_shared_user,
    get_invites,
    update_invite,
    get_user_accepted,
    get_folder_users,
    get_folder_admin,
    get_folder_info
}