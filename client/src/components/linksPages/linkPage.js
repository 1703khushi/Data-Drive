import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Signin from './signin'
import GDriveLogo from '../../media/logo_ihub.png'
import '../../styles/FilesView.css'
import FolderIcon from '@mui/icons-material/Folder';
import { config } from '../../env';
import FileItem from '../filesView/FileItem';
import axios from 'axios';


function LinkPage(props) {
    const {id, file, access} = useParams()
    const [requireLogin, setRequireLogin] = useState(true)
    const navigate = useNavigate()
    const [folderinfo, setFolderInfo] = useState({})
    const [files, setFiles] = useState([])

    useEffect(async () => {
        const user = JSON.parse(localStorage.getItem('dfs-user'))
        if(access == 'true' && user == null){
            setRequireLogin(true)
        }
        else setRequireLogin(false)

        await axios.get(`${config.BASE_URL}/sharelinks/files`,
        {
            params: {
                parent: id,
                file: file
            },
        }).then(response => {
            console.log(response)
            setFolderInfo(response.data.folder_info)
            setFiles(response.data.objects.map(file => {
                let name = file.name.split('/')[1].split('|')
                let creater;
                console.log(name)
                if(name.length > 1)
                {
                    creater = name[0]
                    name = name[1]
                }
                else{
                    creater = response.data.folder_info.user
                }
                console.log(name)
                return {...file, name: name, creater}
              }));
        }).catch(err => {
            console.log(err)
        })

    },[id])
  return (
    <div>
    {
        requireLogin == true
        ?<Signin 
            user={props.user}
            setUser = {props.setUser}
            setIsAdmin = {props.setIsAdmin}
            setAdminDashboard = {props.setAdminDashboard}
            setRequireLogin={setRequireLogin}
        />
        :<div style={{margin: '1rem'}}>
            <div className='link-header' style={{textAlign: 'center'}}>
                <img src={GDriveLogo} style={{height: '20vh', cursor: 'pointer'}}
                    onClick={e => navigate('/')}
                ></img>        
            </div>
            <div className='d-flex link-body' style={{
                margin: 'auto',
                width: '80%'
            }}>
                <div className='d-flex link-folder'>
                    <FolderIcon sx={{color: 'orange', fontSize: '3rem'}}/>
                    <span className='ms-1' style={{fontWeight: 'bolder', fontSize: '1.5rem'}}>{folderinfo?.folder}</span>
                </div>
            </div>
            <div style={{
                margin: 'auto',
                width: '75%'
            }}>
            <div className="fileView__titles">
                <div className="d-flex fileView__titles--left" style={{width: '100%'}}>
                    <p style={{flex: 1}}>Name</p>
                    <p style={{flex: 1}}>Uploader</p>
                </div>
                <div className="fileView__titles--right">
                    <p>Last modified</p>
                    <p>File size</p>
                </div>
            </div>
            { files.length > 0
                ?files?.map((item,idx) => (
                    <FileItem id={`fileitem${idx}`} 
                        caption={item.name} 
                        creater={item.creater}
                        timestamp={item.lastModified} 
                        fileUrl={""} 
                        size={item.size}
                        folders={[{id: id}]}
                        setFiles={setFiles}
                    />
                ))
                :<h5 style={{fontStyle: 'italic', textAlign: 'center'}}>No Files Uploaded</h5>
            }
            </div>


        </div>
    }
    </div>
  )
}

export default LinkPage
