import React from 'react'
import { useState } from 'react';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import '../../styles/FolderItem.css'
import axios from 'axios';
import GDriveLogo from '../../media/logo_ihub.png'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Drawer from '@mui/material/Drawer';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'

import { config } from '../../env'

        

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
function FolderItem({name, id, viewothers, folders}) {
    const [open, setOpen] = useState(false)
    const [shareusers, setShareUsers] = useState([])
    const [users, setUsers] = useState([])
    const [moderator, setModerator] = useState('')


    const handleOpen = async (e) => {
        e.stopPropagation()
        await axios.get(`${config.BASE_URL}/myshared/users`,
        {
            params: {
                viewothers: folders.length == 1?viewothers:folders[1].viewothers,
                id: folders.length == 1?id:folders[1].id,
            },
            headers: {
                'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
            }
        }).then(response => {
            console.log(response.data)
            setUsers(response.data.users)
            setModerator(response.data.moderator)
        }).catch(err => {
            console.log(err)
        })
        setOpen(true)
    }
    const handleClose = (e) => {
        e.stopPropagation()
        setOpen(false)
    }

    return (
        <div className='folderItem'>
            <FolderRoundedIcon style={{color: 'orange'}} />
            <div className='folderItemName'>
                {name}
            </div>
            <div class="ViewOthers">
                <button className="btn p-0" type="button" aria-haspopup="false" aria-expanded="true"
                    onClick={e => handleOpen(e)} 
                >
                    <GroupOutlinedIcon />
                </button>
            </div>
            
            <Drawer
                anchor='right'
                open={open}
                onClose={e => handleClose(e)}
                onClick={e => e.stopPropagation()}
            >
                <div style={{minWidth: '25vw'}}>
                    <div className='ViewOthers__heading mt-1' style={{
                        textAlign: 'center',
                    }}>
                        <img src={GDriveLogo} style={{width: '25vh', maxHeight: '25vh'}}/>
                        <h2>Users</h2>
                        <hr />
                    </div>
                    <div className='m-2 ViewOthers__body'>
                        <div style={{marginBottom: '1rem'}}>
                            <span style={{fontSize: '1.2rem', display: 'block', fontWeight: 'bolder'}}>Moderator:</span>
                            <div style={{
                                width: '80%',
                                margin: 'auto',
                                display: 'flex',
                                columnGap: '5px',
                                marginTop: '10px'
                            }}>
                                <AdminPanelSettingsOutlinedIcon />
                                <span style={{fontStyle: 'italic'}}>{moderator}</span>
                            </div>
                        </div>
                        <div>
                            <span style={{fontSize: '1.2rem', display: 'block', fontWeight: 'bolder'}}>Participants:</span>
                            <div style={{
                                width: '80%',
                                margin: 'auto',
                                display: 'flex',
                                columnGap: '5px',
                                marginTop: '10px'
                            }}>
                                <div style={{display: 'flex',rowGap: '10px', flexDirection: 'column'}}>
                                {
                                    users.map(user => {
                                        return (
                                            <div className='d-flex' style={{width: '100%', columnGap: '5px'}}>
                                                <AccountCircleOutlinedIcon />
                                                <span>{user.user}</span>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                                
                            </div>
                        </div>

                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default FolderItem