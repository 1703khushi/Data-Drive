import React from 'react'
import '../../styles/SideIcons.css'
import AddIcon from '@material-ui/icons/Add';
import ImageIcon from '@mui/icons-material/Image';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'

const index = () => {
    return (
        <div className='sideIcons'>
            <div className="sideIcons__plusIcon" style={{cursor: "pointer", marginTop: 5}}>
               <DriveFileMoveIcon />
            </div>
           
            <hr />

            <div className="sideIcons__plusIcon" style={{cursor: "pointer"}}>
               <ImageIcon />
            </div>
        </div>
    )
}

export default index
