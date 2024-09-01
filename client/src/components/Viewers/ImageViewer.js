import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import OpenSeadragon from "openseadragon"
import '../../styles/ImageViewer.css'
import axios from 'axios'
import { config } from '../../env'


function ImageViewer() {
    const {id, file} = useParams()
    let viewer;
    useEffect(async () => {
        console.log(id, file)
        let bucketURL = config.BASE_URL+"/getLinks/link";
        try {
          console.log("Getting Object link")
          const response = await axios.get(bucketURL,
          {
              params: {
                parent: id,
                file: file,
              },
              headers: {
                  'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
              }
          });
          console.log("Got object link");
          console.log(response.data)
          viewer =OpenSeadragon({
            id: 'ImageViewer',
            prefixUrl:' https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/',
            tileSources: {
                  type: 'image',
                  url: `${response.data.link}`,
                  buildPyramid: false
            },
            animationTime: 0.5,
            blendTime: 0.1,
            constrainDuringPan: true,
            maxZoomPixelRatio: 2,
            minZoomLevel: 1,
            visibilityRatio: 1,
            zoomPerScroll: 2,
            showNavigator:  true,
            ajaxWithCredentials: true,
            sequenceMode:true,
            crossOriginPolicy: "Anonymous"
          });
        } catch (error) {
          console.log(error);
        }
        
    }, [id])
  return (
    <div>
    <h1 style={{textAlign: 'center'}}>Image Viewer</h1>
    <div id='ImageViewer'>
    </div>
    </div>
    
  )
}

export default ImageViewer
