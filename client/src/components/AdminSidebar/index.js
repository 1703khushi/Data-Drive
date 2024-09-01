import React, { useState } from 'react'
import '../../styles/Sidebar.css'

import SidebarItem from '../sidebar/SidebarItem';
import Users from '../AdminDashboard/users.js'

import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';

function Index(props) {
    const [toggle,setToggle] = useState(0)
    const changeadminpanel = (val) => {
        console.log(val)
    }
    
    const togglesidebar = () => {
        setToggle(1 - toggle)
    }
    return (
        toggle == 0
        ?<div className='adminsidebar'>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                <h3 style={{textAlign: 'center', marginTop: '10px', fontWeight: 'bold'}}>
                    Admin Dashboard
                </h3>
                <CloseIcon className=' mt-2' fontSize='large' cursor='pointer'
                    onClick={e => togglesidebar()} 
                />
            </div>
            <div className="sidebar__itemsContainer">
                <div onClick={e => changeadminpanel(0)} style={{cursor: 'pointer'}}>
                    <SidebarItem arrow icon={(<PeopleAltIcon />)} label={'Users'}  />
                </div>
                <div onClick={e => changeadminpanel(1)} style={{cursor: 'pointer'}}>
                    <SidebarItem arrow icon={(<ImportantDevicesIcon />)} label={'Computers'} />
                </div>
                <hr/>
            </div>
        </div>
        :<div>
            <ViewSidebarRoundedIcon className='ms-2 mt-4' fontSize='large' cursor='pointer'
                onClick={e => togglesidebar()} 
            />
        </div>

    )
}

export default Index
