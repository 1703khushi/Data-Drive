import React from 'react'
import { useState } from 'react';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import '../../styles/FolderItem.css'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Chips } from 'primereact/chips';
import { DataGrid } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { config } from '../../env';

        

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
        width: 500,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        transition: 'all 1s'
    },
}));
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
function FolderItem({name, id}) {
    const [open, setOpen] = useState(false)
    const classes = useStyles();
    const [shareusers, setShareUsers] = useState([])
    const [user, setUser] = useState("")
    const [sharepage, setSharePage] = useState(0)
    const [sharedusers, setSharedUsers] = useState([])
    const [pending, setPending] = useState([])
    const [linkaccess, setLinkAccess] = useState(false)

    const [modalStyle] = useState(getModalStyle);

    const handleOpen = async (e) => {
        e.stopPropagation()
        await axios.get(`${config.BASE_URL}/share/folder`,
        {
            params: {
                id: id
            },
            headers: {
                'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
            }
        }).then(response => {
            console.log(response.data)
            setSharedUsers(response.data.sharedusers.map((shared, idx) => {
                return {...shared, id: idx}
            }))
            setPending(response.data.pending.map((pending, idx) => {
                return {...pending, id: idx}
            }))
        }).catch(err => {
            console.log(err)
        })
        setOpen(true)
    }
    const handleClose = (e) => {
        e.stopPropagation()
        setSharePage(0)
        setShareUsers([])
        setOpen(false)
    }
    const removeUser = (id) => {
        setShareUsers(shareusers.filter(share => share.id != id))
    }

    const columns = [
        { 
            field: 'user', 
            headerName: 'email', 
            headerClassName: 'share-table-header',
            headerAlign: 'center',
            flex: 1,
            cellClassName: 'user-share-cell',
            renderCell: (params) => {
                return (
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <span className='user-name'>{params.value}</span>
                    <RemoveCircleOutlineIcon className='remove-user' sx={{marginLeft: '5px'}}
                        onClick={e =>removeUser(params.id)}
                    />
                    </div>

                )
            }
        },
        {
            field: 'Upload',
            headerName: 'Upload',
            headerClassName: 'share-table-header',
            headerAlign: 'center',
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <Checkbox
                        {...label}
                        checked={shareusers[params.id].Upload}
                        onChange={e => {
                            setShareUsers(shareusers.map(share => {
                                if(share.id == params.id){
                                    share.Upload = e.target.checked
                                }
                                return share
                            }))
                        }}
                    />
                )
            }
        },
        {
            field: 'Download',
            headerName: 'Download',
            headerClassName: 'share-table-header',
            headerAlign: 'center',
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <Checkbox
                        {...label}
                        checked={shareusers[params.id].Download}
                        onChange={e => {
                            setShareUsers(shareusers.map(share => {
                                if(share.id == params.id){
                                    share.Download = e.target.checked
                                }
                                return share
                            }))
                        }}
                    />
                )
            }
        },
        {
            field: 'viewothers',
            headerName: 'View Others',
            headerClassName: 'share-table-header',
            headerAlign: 'center',
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <Checkbox
                        {...label}
                        checked={shareusers[params.id].viewothers}
                        onChange={e => {
                            setShareUsers(shareusers.map(share => {
                                if(share.id == params.id){
                                    share.viewothers = e.target.checked
                                }
                                return share
                            }))
                        }}
                    />
                )
            }
        }
    ]

    const columns_shared = (data, setData) => {
        return ([
        { 
            field: 'user', 
            headerName: 'email', 
            headerClassName: 'share-table-header',
            headerAlign: 'center',
            flex: 1,
            cellClassName: 'user-share-cell',
            renderCell: (params) => {
                return (
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <span className='user-name'>{params.value}</span>
                    <RemoveCircleOutlineIcon className='remove-user' sx={{marginLeft: '5px'}}
                        onClick={e =>removeUser(params.id)}
                    />
                    </div>

                )
            }
        },
        {
            field: 'Upload',
            headerName: 'Upload',
            headerClassName: 'share-table-header',
            headerAlign: 'center',
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <Checkbox
                        {...label}
                        checked={data[params.id].Upload}
                        onChange={e => {
                            setData(data.map(share => {
                                if(share.id == params.id){
                                    share.Upload = e.target.checked
                                }
                                return share
                            }))
                        }}
                    />
                )
            }
        },
        {
            field: 'Download',
            headerName: 'Download',
            headerClassName: 'share-table-header',
            headerAlign: 'center',
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <Checkbox
                        {...label}
                        checked={data[params.id].Download}
                        onChange={e => {
                            setData(data.map(share => {
                                if(share.id == params.id){
                                    share.Download = e.target.checked
                                }
                                return share
                            }))
                        }}
                    />
                )
            }
        },
        {
            field: 'viewothers',
            headerName: 'View Others',
            headerClassName: 'share-table-header',
            headerAlign: 'center',
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <Checkbox
                        {...label}
                        checked={data[params.id].viewothers}
                        onChange={e => {
                            setData(data.map(share => {
                                if(share.id == params.id){
                                    share.viewothers = e.target.checked
                                }
                                return share
                            }))
                        }}
                    />
                )
            }
        }
    ])}

    const shareFolder = async (e) => {
        const share = await axios.post(`${config.BASE_URL}/share/folder`,
        {id: id, name: name, users: shareusers},
        {
            headers: {
                'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
            }
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
        handleClose(e)

    }
    const handleKey = (e) => {
        if(e.key === 'Enter')
        {
            setShareUsers([...shareusers,{
                id: shareusers.length,
                user: user,
                Upload: true,
                Download: true,
                viewothers: true
            }])
            setUser("")
        }
    }

    const linkCopy = () => {
        console.log('hello')
        return 'fdsfsdfsdfsdfs'
    }

    return (
        <div className='folderItem'>
            <FolderRoundedIcon style={{color: 'orange'}} />
            <div className='folderItemName' >
                {name}
            </div>
            <div class="dropdown">
                <button className="btn p-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="false" aria-expanded="true"
                    onClick={e => e.stopPropagation()} 
                >
                    <MoreVertIcon />
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" onClick={e => handleOpen(e)}>Share</a>
                </div>
            </div>
            <Modal
                open={open}
                onClose={e => handleClose(e)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                onClick={e => e.stopPropagation()}
            >
            <div style={modalStyle} className={classes.paper}>
                <div className='d-flex' style={{justifyContent: 'space-between'}}>
                    <div className='d-flex'>
                        {
                            sharepage == 1
                            ?<ArrowBackIcon className='share-page-back-arrow me-1'
                                onClick={e => setSharePage(0)}
                            />
                            :<></>
                        }
                        <p>Share {name}!</p>
                    </div>
                    {sharepage == 0
                        ?<div style={{display: 'flex'}}>
                            <Switch 
                                onChange={e => setLinkAccess(e.target.checked)}
                            />
                            {
                                linkaccess == false
                                ?<p className='mt-1' style={{fontStyle: 'italic'}}>Anyone with Link</p>
                                :<p className='mt-1' style={{fontStyle: 'italic'}}>People with access</p>
                            }
                        </div>
                        :<></>
                    }
                </div>
                <hr />
                {
                    sharepage == 1
                    ?<>
                        <div class="mb-3">
                            <input class="form-control" type="text" id="name" 
                                value = {user}
                                onChange={e => setUser(e.target.value)}
                                placeholder='Add user'
                                onKeyDown={handleKey}
                            />
                            <div className='share_perms'>
                                <div style={{width: '100%' }}>
                                    <DataGrid
                                    rows={shareusers}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                        },
                                    }}
                                    pageSizeOptions={[5]}
                                    disableRowSelectionOnClick
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button className = "btn btn-success"
                                onClick={e => shareFolder(e)}
                            >Share</button>
                        </div>
                    </>
                    :
                    <>
                        <div class="mb-3">
                        <span>People With Access</span>
                        <div className='mt-1'>
                            <div style={{width: '100%' }}>
                                <DataGrid
                                rows={sharedusers}
                                columns={columns_shared(sharedusers, setSharedUsers)}
                                columnHeaderHeight={0}
                                initialState={{
                                    pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                    },
                                }}
                                pageSizeOptions={[5]}
                                disableRowSelectionOnClick
                                />
                            </div>
                        </div>
                        <hr className='m-3'></hr>
                        <span>Pending Invites</span>
                        <div className='mt-1'>
                            <div style={{width: '100%' }}>
                                <DataGrid
                                rows={pending}
                                columns={columns_shared(pending, setPending)}
                                columnHeaderHeight={0}
                                initialState={{
                                    pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                    },
                                }}
                                pageSizeOptions={[5]}
                                disableRowSelectionOnClick
                                />
                            </div>
                        </div>
                        </div>
                        <div className='d-flex justify-content-around'>
                            <CopyToClipboard text={`${config.PUBLICK_URL}/link/${id}/folder/${linkaccess}`}>
                            <div className='d-flex Link_Button' style={{curson: 'pointer'}}>                            
                            <LinkIcon />
                            <p className='ms-1'>Copy Link</p>
                            </div>
                            </CopyToClipboard>
                            <button className = "btn btn-success"
                                onClick={e => setSharePage(1)}
                            >Add users</button>
                        </div>
                    </>
                }
            </div>
            </Modal>
        </div>
    )
}

export default FolderItem