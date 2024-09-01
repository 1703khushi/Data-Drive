import axios from 'axios'
import React, { useEffect, useState } from 'react'
import InviteCard from './inviteCard'
import { config } from '../../env'

function Invites() {
    const [invites, setInvites] = useState([])

  useEffect(async () => {
     await axios.get(`${config.BASE_URL}/share/invites`,
     {
        headers: {
            'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
        }
     })
     .then(response => {
        console.log(response)
        if(response.data.error == false)
        {
            setInvites(response.data.invites)
        }
     }).catch(err => {
        console.log(err)
     })
  }, [])

  return (
    <div className='fileView'>
        <h2 style={{marginTop: '1rem'}}>Invites</h2>
        <div className='invites'>
        {
            invites.length > 0
            ?<div style={{display: 'flex', flexDirection: 'column', columnGap: '1rem'}}>
                {
                    invites.map(invite => {
                        return <InviteCard invite={invite} setInvites={setInvites} />

                    })
                }
            </div>
            :<h3 style={{textAlign: 'center'}}>No Invites</h3>
        }

        </div>
      
    </div>
  )
}

export default Invites
