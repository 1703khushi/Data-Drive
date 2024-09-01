import React, { useState, useEffect, useContext, createContext, useRef } from 'react'
import '../../styles/FilesView.css'

import FileItem from './FileItem'
import FolderItem from './FolderItem'
import SkeletonFileView from '../Skeleton/skeletonFileView'
import { config } from '../../env'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import axios from 'axios'
import { Navigate, useParams, useNavigate } from 'react-router-dom'

const Accepted = ({search}) => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [files, setFiles] = useState([])
    const [folders, setFolders] = useState(JSON.parse(localStorage.getItem('shared_folders')))
    const [childFolders, setChildFolders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(async () => {
        localStorage.setItem('share', true)
        console.log(id)
        console.log("Getting files")
        let x = folders
        if(id != undefined && folders.length == 1)
        {
            x = JSON.parse(localStorage.getItem('shared_folders'))
            console.log(x)
            setFolders(x)
        }
        const {Download, Upload, creater_bucket, viewothers} = x.length > 1?x[1]:x[0]
        setLoading(true)
        await axios.get(`${config.BASE_URL}/myshared/files`,
        {
            params: {
                parent: x[x.length - 1]?.id,
                parent_name:  x[x.length - 1]?.folder,
                creater: creater_bucket,
                Download,
                Upload,
                viewothers
            },
            headers: {
                'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
            }
        })
        .then(response => {
          console.log(response.data)
          setFiles(response.data.objects.map(file => {
            let name = file.name.split('/')[1].split('|')
            let creater;
            let author = false;
            console.log(name)
            if(name.length > 1)
            {
                creater = name[0]
                name = name[1]
            }
            else{
                creater = creater_bucket
                author = true
            }
            console.log(name)
            return {...file, name: name, creater, author}
          }));
          setChildFolders(response.data.accepted)
        })
        .catch(error => {
          console.log(error);
        });
        console.log(loading)
        setLoading(false)
    }, [id])

    const folderNavigate = (idx) => {
        let newF= childFolders[idx]
        setFolders([...folders, newF])
        localStorage.setItem('shared_folders', JSON.stringify([...folders, newF]))
        let folderID = childFolders[idx].id
        navigate(`/shared/${folderID}`)
    }
    const redirectFolder = (item, idx) => {
        let temp = folders.slice(0,idx+1)
        setFolders(temp)
        localStorage.setItem('shared_folders', JSON.stringify(temp))
        navigate(`/shared/${item.id}`)
    }
    const searchFiles = () => {
        console.log(files)
        return files.filter((item) =>
            item.name[0].toLowerCase().includes(search.toLowerCase())
        );
    }

    return (
        loading == false
        ?<div className='fileView'>
            {id
                ?<div style={{display: 'flex', flexDirection: 'row', marginTop: '1rem'}}>
                    {  
                        folders.map((item,idx) => {
                            return (
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <h3 style={{cursor: 'pointer'}} onClick={e => redirectFolder(item, idx)}>{item.folder}</h3>
                                <ChevronRightRoundedIcon className = 'mt-0' fontSize='large'/>
                            </div>
                            )   
                        })
                    }
                </div>
                :<h3 style={{marginTop: '1rem'}}>My Shared</h3>
            }
            <div>
            {childFolders.length > 0
                ?<>
                <h5>Folders</h5>
                <div className = "childFolders ms-2 mb-3">
                {
                    childFolders?.map((item, idx) => {
                        return (
                            <div onClick = {e => folderNavigate(idx)} style={{cursor: 'pointer'}}>
                                <FolderItem name={item.folder} id={item.id} viewothers={item.viewothers}
                                    folders = {folders}
                                />
                            </div>
                        )
                    })
                }
                </div>
                </>
                :<></>
            }
            </div>
            <div>
            <h5>Files</h5>
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
                ?searchFiles()?.map((item,idx) => (
                    <FileItem id={`fileitem${idx}`} 
                        caption={item.name}
                        creater={item.creater}
                        author={item.author}
                        timestamp={item.lastModified} 
                        fileUrl={""} 
                        size={item.size} 
                        folders={folders} 
                        setFiles={setFiles}
                    />
                ))
                :<h5 style={{fontStyle: 'italic', textAlign: 'center'}}>No Files Uploaded</h5>
            }
            </div>
        </div>
        :<div className='fileView'>
            {id
                ?<div style={{display: 'flex', flexDirection: 'row', marginTop: '1rem'}}>
                    {  
                        folders.map((item,idx) => {
                            return (
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <h3 style={{cursor: 'pointer'}} onClick={e => redirectFolder(item, idx)}>{item.folder}</h3>
                                <ChevronRightRoundedIcon className = 'mt-0' fontSize='large'/>
                            </div>
                            )   
                        })
                    }
                </div>
                :<h3 style={{marginTop: '1rem'}}>My Drive</h3>
            }
            <SkeletonFileView />
        </div>
    )
}

export default Accepted
