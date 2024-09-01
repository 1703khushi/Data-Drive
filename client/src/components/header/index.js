import React, { useEffect, useState } from 'react'
import '../../styles/Header.css'

import GDriveLogo from '../../media/logo_ihub.png'

import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AppsIcon from '@material-ui/icons/Apps';
import { green } from '@material-ui/core/colors';
import PersonIcon from '@material-ui/icons/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Logout from '@mui/icons-material/Logout';


const handleLogout = (setUser) => {
    console.log('Logout')
    localStorage.removeItem('dfs-user')
    localStorage.removeItem('Login')
    localStorage.removeItem('folders')
    setUser("false")
}

function Index ({ user, setUser, isAdmin, adminDashboard, setAdminDashboard, search, setSearch}) {
    const [label, setLabel] = useState('')
    useEffect(() => {
        setLabel(JSON.parse(localStorage.getItem('dfs-user'))?.user['first_name'][0])
    },[user])
    return (
        <div className='header'>
            <div className="header__logo">
                <img src={GDriveLogo} alt="Google Drive" />
                <span>Drive</span>
            </div>
            <div className="header__searchContainer">
                <div className="header__searchBar">
                    <SearchIcon />
                    <input type="text" placeholder='Search in Drive' value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <ExpandMoreIcon />
                </div>
            </div>
            <div className="header__icons" style={{paddingRight: 3}}>
                <div class="dropdown">
                    <button class="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="false" aria-expanded="true">
                        <SettingsIcon />
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" onClick={e => handleLogout(setUser)}>Logout<Logout /></a>
                        {isAdmin == true
                        ?adminDashboard == false
                            ?<a class="dropdown-item" onClick={e => setAdminDashboard(true)}>Admin Dashboard<Logout /></a>
                            :<a class="dropdown-item" onClick={e => setAdminDashboard(false)}>Drive<Logout /></a>
                        :<></>
                        }
                    </div>
                </div>
                <AppsIcon />
                {
                    user == "true"?
                    (
                        <div style={{backgroundColor: "green",padding: 2,paddingLeft: 12, paddingRight: 12 ,fontSize: "1.5rem", borderRadius: 50, color: "white"}} >
                            <span>{label}</span>
                        </div>
                    )
                    :
                    (
                        <PersonIcon />
                    )
                }
            </div>
        </div>
    )
}

export default Index
