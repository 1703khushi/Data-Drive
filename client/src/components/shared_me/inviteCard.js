import React from 'react'
import '../../styles/inviteCard.css'
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import { config } from '../../env';
import axios from 'axios';
function InviteCard({invite, setInvites}) {
    const action = async (act) => {
        await axios.post(`${config.BASE_URL}/share/inviteAction`,{
            accepted: act,
            id: invite.id
        },{
            headers: {
                'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
            }
        }).then(response => {
            console.log(response)
            if(response.data.error == false)
            {
                setInvites(prev => prev.filter(item => item.id != invite.id))
            }
        }).catch(err => {
            console.log(err)
        })
    }
  return (
    <div className='invite_card'>
        <div className='invite_folder_name'>
            <div>
                <FolderRoundedIcon style={{color: 'orange'}}/>
                <span className='ms-1' 
                    style={{
                        fontWeight: 'bold'
                    }}
                >{invite.folder}</span>
            </div>
            <span 
                style={{
                    fontStyle: 'italic',
                    fontSize: '0.9rem'
                }}
            >Admin: {invite.creater_bucket}</span>
        </div>
        <hr></hr>
        <div className='invite_permission'>
            <div className='invite_permission_row'>
                <div
                    style={{
                        flex: '80%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}
                >
                    <div>
                        <span>Upload</span>
                        <br></br>
                        {invite.Upload == 1
                            ?<CheckCircleIcon sx={{width: '100%',margin: 'auto', marginTop: '5px', color: 'green'}}/>
                            :<CancelIcon sx={{width: '100%',margin: 'auto', marginTop: '5px', color: 'red'}}/>
                        }
                    </div>
                    <div>
                        <span className='m-1'>Download</span>
                        <br></br>
                        {invite.Download == 1
                            ?<CheckCircleIcon sx={{width: '100%',margin: 'auto', marginTop: '5px', color: 'green'}}/>
                            :<CancelIcon sx={{width: '100%',margin: 'auto', marginTop: '5px', color: 'red'}}/>
                        }                    </div>
                    <div>
                        <span className='m-1'>View Others</span>
                        <br></br>
                        {invite.viewothers == 1
                            ?<CheckCircleIcon sx={{width: '100%',margin: 'auto', marginTop: '5px', color: 'green'}}/>
                            :<CancelIcon sx={{width: '100%',margin: 'auto', marginTop: '5px', color: 'red'}}/>
                        }                    </div>
                </div>
                <div style={{
                    flex: '20%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <span></span>
                        <br></br>
                        <Button variant="outlined" color="success" onClick={e => action(1)} >
                            Accept
                        </Button>
                    </div>
                    <div>
                        <span></span>
                        <br></br>
                        <Button variant="outlined" color="error" onClick={e => action(0)} >
                            Reject
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InviteCard
