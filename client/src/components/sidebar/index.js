import React, { useState } from 'react'
import '../../styles/Sidebar.css'
import { useNavigate } from 'react-router-dom';

import NewFile from './NewFile'
import SidebarItem from './SidebarItem';
import StorageBar from './storagebar';
import ListGroup from 'react-bootstrap/ListGroup';

import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import StorageIcon from '@material-ui/icons/Storage';
import { grey } from '@material-ui/core/colors';
import ArrowRight from '@mui/icons-material/ArrowRight';

function Index({storage, folders, setFolders}) {
    const navigate = useNavigate()
    const [openshared, setOpenShared] = useState(0)

    const openshareddropdown = () => {
        if(openshared == 0)
        {
            document.querySelector('.shared_me_dropdown').style.maxHeight = '100px';
            setOpenShared(1)
        }
        else{
            document.querySelector('.shared_me_dropdown').style.maxHeight = '0px';
            setOpenShared(0)
        }
    }
    const navigateInvites = () => {
        navigate('/shared/invites')
        openshareddropdown(1)

    }
    const navigateAccepted = () => {
        localStorage.setItem('shared_folders', JSON.stringify([{
            folder: 'My Shared', 
            id: '',
            Download: 1,
            Upload: 1,
            viewothers: 1,
            creater_bucket: 'admin'
        }]))
        navigate('/shared')
        openshareddropdown(1)
    }

    return (
        <div className='sidebar'>
            <NewFile 
                folders={folders}
                setFolders={setFolders}   
            />

            <div className="sidebar__itemsContainer">
                <div onClick={e => {
                    localStorage.setItem('folders', [JSON.stringify([{folder: 'My Drive', id: ''}])])
                    navigate('/')
                }}>
                <SidebarItem arrow icon={(<InsertDriveFileIcon />)} label={'My Drive'} />
                </div>
                <SidebarItem arrow icon={(<ImportantDevicesIcon />)} label={'Computers'} />
                <div style={{cursor: 'pointer'}} >
                <div onClick={e => openshareddropdown()}>
                <SidebarItem arrow icon={(<PeopleAltIcon />)} label={'Shared with me'} />
                </div>
                <div className='shared_me_dropdown'>
                    <ListGroup>
                    <ListGroup.Item action
                        onClick={e => navigateAccepted()}
                    >
                        <ArrowRight />
                        Accepted
                    </ListGroup.Item>
                    <ListGroup.Item action
                        onClick={e => navigateInvites()}
                    >
                        <ArrowRight />
                        Invites
                    </ListGroup.Item>
                    </ListGroup>

                </div>
                </div>
                <SidebarItem icon={(<DeleteOutlineIcon />)} label={'Bin'} />
                
                <hr/>
                
                <SidebarItem icon={(<StorageIcon />)} label={'Storage'} />
                <div className='storagebar ps-3 pt-0' style={{textAlign: 'center'}}>
                    <StorageBar storage={storage[0]} maxStorage={storage[1]}/>
                    <span style={{color: '#757575'}}>{storage[0] / 1000} KB of {storage[1] / 1000} KB</span>
                </div>


            </div>

        </div>
    )
}

export default Index
