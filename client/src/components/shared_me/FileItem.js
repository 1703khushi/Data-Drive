import React, { useState } from 'react'
import '../../styles/FileItem.css'
import axios from 'axios';
import { config } from '../../env';

import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const FileItem = ({ id, author, creater, caption, timestamp, fileUrl, size, folders, setFiles }) => {
    const [downloading, setDownloading] = useState(false)
    // const fileDate = `${timestamp?.toDate().getDate()} ${monthNames[timestamp?.toDate().getMonth() + 1]} ${timestamp?.toDate().getFullYear()}`
    const fileDate = `3 Dec 2023`
    const getReadableFileSizeString = (fileSizeInBytes) => {
        let i = -1;
        const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
        do {
            fileSizeInBytes = fileSizeInBytes / 1024;
            i++;
        } while (fileSizeInBytes > 1024);

        return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
    };

    const removeObject = async (e) => {
        e.preventDefault();
        let bucketURL = config.BASE_URL+"/files/removeObject";
        try {
          console.log("Deleting Object")
          const response = await axios.post(bucketURL,
          {
            parent: folders[folders.length - 1].id,
            file: caption,
            size: size
          },
          {
              headers: {
                  'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
              }
          });
          console.log("Delete complete");
          console.log(response);
          if(response.data.error == false)
          {
            setFiles(prev => prev.filter(file => file.name != caption))
          }
        } catch (error) {
          console.log(error);
        }
    }

    const getLink = async (e) => {
        e.preventDefault();
        setDownloading(true)
        let bucketURL = config.BASE_URL+"/getLinks/mysharelink";
        try {
          const {Download, Upload, creater_bucket, viewothers} = folders.length > 1?folders[1]:folders[0]
          console.log("Getting Object link")
          const response = await axios.get(bucketURL,
          {
              params: {
                parent: folders[folders.length - 1].id,
                file: caption,
                creater: author == false?creater:'',
                creater_bucket: creater_bucket,
                Download: Download
              },
              headers: {
                  'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
              }
          });
          console.log("Got object link");
          console.log(response);
          const link = document.createElement("a");
          link.download = caption;
          link.href = response.data.link;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.log(error);
        }
        setDownloading(false)
    }

    return (
        <div className='fileItem'>
            <a>
                <div style={{flex: 1}}>
                <div className="d-flex mb-0 fileItem--left" style={{columnGap: '5px', flex: 1}}>
                    <InsertDriveFileIcon />
                    <p>{caption}</p>
                    <DeleteOutlineRoundedIcon className='deleteFile' sx={{color: 'red'}}
                        onClick={e => removeObject(e)}
                    />
                    {downloading == false
                        ?<CloudDownloadOutlinedIcon className='deleteFile'
                            onClick={e => getLink(e)}
                        />
                        :<AutorenewOutlinedIcon className='downloading'/>
                    }
                    <a href={`/view/${folders[folders.length - 1].id != ''?folders[folders.length - 1].id:0}/${caption}`} target='_blank'>
                        <VisibilityIcon className='deleteFile' />
                    </a>
                </div>
                <div style={{flex: 1, marginBottom: '0', fontStyle: 'italic'}}>
                    <p>{creater}</p>
                </div>
                </div>
                <div className="fileItem--right">
                    <p>{fileDate}</p>
                    <p>{getReadableFileSizeString(size)}</p>
                </div>
            </a>
        </div>
    )
}

export default FileItem
