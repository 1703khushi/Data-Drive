import React, { useState, useEffect } from 'react'
import DataTable from './users'

const index = ({adminpanel}) => {
    return (
        adminpanel == 0
            ?<DataTable />
            :<></>
    )
}
export default index