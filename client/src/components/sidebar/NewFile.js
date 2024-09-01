import React, { useState } from 'react'
import '../../styles/NewFile.css'
import '../../styles/FileItem.css'

import AddIcon from '@material-ui/icons/Add';
import axios from 'axios'

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { config } from '../../env';
import { useStepContext } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function getModalStyle() {
    return {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
    };
}
const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


const NewFile = ({folders, setFolders}) => {
    const classes = useStyles();

    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [openfolder, setOpenFolder] = useState(false)
    const [file, setFile] = useState([])
    const [name, setName] = useState("")
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenFolder = () => {
        setOpenFolder(true);
    };

    const handleCloseFolder = () => {
        setOpenFolder(false);
    };

    const handleChange = (e) => {
        setFile(e.target.files)
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        const share = localStorage.getItem('share')
        let x;
        let bucketURL;
        if(share == 'true')
        {
            bucketURL = config.BASE_URL+"/myshared";
            x = JSON.parse(localStorage.getItem('shared_folders'))
            if(x.length == 1)
            {
                setUploading(false)
                alert("Cant upload in My drive")
                setOpen(false)
                setFile(null)
                return
            }
        }
        else{
            bucketURL = config.BASE_URL+"/files";
            x = folders
        }
        setUploading(true)
        setUploaded(false)
        const formData = new FormData();
        console.log(file)
        for(let i=0;i<file.length;i++)
        {
            formData.append('files', file[i]);
        }
        try {
          console.log("Initiating upload")
          const response = await axios.post(bucketURL, formData,
          {
              params: {
                parent: x[x.length-1]?.id,
                Upload: share == 'true'?x[1].Upload:0,
                creater: share == 'true'?x[1].creater_bucket:''
              },
              headers: {
                  'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
              }
          });
          console.log("Upload complete");
          console.log(response);
          setUploaded(true)
          alert("File uploaded")
          setUploading(false)
          setOpen(false)
          setFile(null)
        } catch (error) {
          console.log(error);
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        const share = localStorage.getItem('share')
        let x;
        let bucketURL;
        if(share == 'true')
        {
            bucketURL = config.BASE_URL+"/myshared/newFolder";
            x = JSON.parse(localStorage.getItem('shared_folders'))
            if(x.length == 1)
            {
                setUploading(false)
                alert("Cant upload in My drive")
                setOpen(false)
                setFile(null)
                return
            }
        }
        else{
            bucketURL = config.BASE_URL+"/files/newFolder";
            x = folders
        }
        setUploading(true)
        try {
          console.log("Initiating Folder")
          const response = await axios.post(bucketURL,
          {
            name: name, 
            parent: x[x.length - 1].folder,
            Upload: share == 'true'?x[1].Upload:0,
            creater: share == 'true'?x[1].creater_bucket:''
          },
          {
              headers: {
                  'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
              }
          });
          console.log("Created Folder");
          console.log(response);
          alert("Folder Created")
          setOpenFolder(false)
          setName("")
        } catch (error) {
          console.log(error);
        }
        setUploading(false)
    }

    return (
        <div className='newFile dropdown'>
            <div className="newFile__container" data-bs-toggle="dropdown">
                <AddIcon fontSize='large' />
                <p style={{margin: "auto", marginLeft: "10px"}}>New</p>
            </div>
            <div className='dropdown-menu'>
                <a class="dropdown-item" onClick={handleOpenFolder}>New Folder<ArrowRightIcon /></a>
                <a class="dropdown-item" onClick={handleOpen}>New File<ArrowRightIcon /></a>
            </div>

            <Modal
            open={openfolder}
            onClose={handleCloseFolder}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <p>Create Folder!</p>
                <hr />
                {
                    (
                            <>
                                <div class="mb-3">
                                    <label for="name" class="form-label">Folder Name</label>
                                    <input class="form-control" type="text" id="name" 
                                        value = {name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <button className = "btn btn-success" onClick={e => handleCreate(e)}>Create</button>
                                </div>
                            </>
                    )
                }
            </div>
            </Modal>


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <p>Select files you want to upload!</p>
                    <hr />
                    {
                        uploading ? (
                            <div style={{display: 'flex', flexDirection: 'column', rowGap: '10px'}}>
                                {
                                    Array.from(file).map(item => {
                                        return (
                                        <div style={{margin: 'auto', width: '90%',display: 'flex', justifyContent: 'space-between'}}>
                                            <span style={{overflowX: 'scroll',textOverflow: 'ellipsis'}}>{item.name}</span>
                                            {
                                                uploaded == true
                                                ?<CheckCircleIcon sx={{color: 'green'}} />
                                                :<AutorenewIcon className='downloading' style={{color: 'blue'}}/>
                                            }
                                        </div>
                                        )
                                    })
                                }
                            </div>
                        ) : (
                                <>
                                    <div class="mb-3">
                                        <label for="formFile" class="form-label">Choose File</label>
                                        <input class="form-control" type="file" multiple id="formFile" onChange={handleChange}/>
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <button className = "btn btn-success" onClick={e => handleUpload(e)}>Upload</button>
                                    </div>
                                </>
                            )
                    }
                </div>
            </Modal>
        </div>
    )
}

export default NewFile
