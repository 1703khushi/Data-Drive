import Skeleton from "./skeleton";

export default function SkeletonFileView () {
    return (
        <div className="post">
            <Skeleton classes="view-card" />
            <Skeleton classes="heading width-20" />
            <div className = "childFolders ms-2 mb-3">
                <Skeleton classes="folder" />
                <Skeleton classes="folder" />
                <Skeleton classes="folder" />
            </div>
            <Skeleton classes="heading width-10" />
            <div style={{display: 'flex',flexDirection: 'column' ,rowGap: '0.5rem'}}>
            <div className='fileItem'>
            <a>
                <div style={{width: '70%'}}>
                    <Skeleton classes="InsertDriveFileIcon" />
                    <Skeleton classes="caption" />
                </div>
                <div style={{width: '30%'}}>
                    <Skeleton classes="fileDate" />
                    <Skeleton classes="fileSize" />
                </div>
            </a>
            </div>
            <div className='fileItem'>
            <a>
                <div style={{width: '70%'}}>
                    <Skeleton classes="InsertDriveFileIcon" />
                    <Skeleton classes="caption" />
                </div>
                <div style={{width: '30%'}}>
                    <Skeleton classes="fileDate" />
                    <Skeleton classes="fileSize" />
                </div>
            </a>
            </div>
            <div className='fileItem'>
            <a>
                <div style={{width: '70%'}}>
                    <Skeleton classes="InsertDriveFileIcon" />
                    <Skeleton classes="caption" />
                </div>
                <div style={{width: '30%'}}>
                    <Skeleton classes="fileDate" />
                    <Skeleton classes="fileSize" />
                </div>
            </a>
            </div>
            </div>
            
        </div>
    );
}