import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import StorageBar from '../sidebar/storagebar';
import { config } from '../../env';
import Button from 'react-bootstrap/Button';

export default function DataTable() {
  const [rows, setRows] = React.useState([])
  const [maxStorages, setMaxStorages] = React.useState([])

  const columns = (maxStorages, setMaxStorages) =>{
    return ([
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'user', headerName: 'email', flex: 1 },
      {
        field: 'current_storage',
        headerName: 'Current Storage(KB)',
        flex: 0.5,
        renderCell: (params) => {
          return (
            <div className='storagebar pe-3' style={{ width: '80%'}}>
              <span>{params.value / 1000} KB</span>
              <StorageBar storage={params.value / 1000} maxStorage={params.row.max_storage / 1000}/>
            </div>
          )
        }
      },
      {
        field: 'max_storage',
        headerName: 'Max Storage(KB)',
        sortable: false,
        flex: 0.5,
        renderCell: (params) => {
          return (
            <div>
              <input type='number'
                placeholder='Max Storage'  
                style={{
                  width: '80px',
                  borderColor: 'inherit'
                }}
                value={maxStorages[params.id-1]}
                onChange={e => setMaxStorages(maxStorages.map((ma,idx) => {
                  if(idx == (params.id - 1)) return e.target.value
                  else return ma
                }))}
              />
              <span className='ms-1 me-1'>KB</span>
              <Button className='p-1' variant="outline-success"
                disabled={params.value / 1000 == maxStorages[params.id-1]?true:false}
                onClick={e => maxUpdated(params.id)}
              >Upgrade</Button>
              <br></br>
            </div>
          )
        }
        // valueGetter: (params) =>
        //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      },
    ]);
  }

  const maxUpdated = async (id) => {
    const newStorage = maxStorages[id-1]
    await axios.post(`${config.BASE_URL}/admin/maxstorage`,{
      newStorage: newStorage,
      bucket: rows[id-1].bucket_name
    },{
      headers: {
        'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
    }
    }).then(response => {
      console.log(response)
      if(response.data.error == false)
      {
        alert('Storage Updated')
      }
      else{
        alert(`Error: ${response.data.message}`)
      }
    }).catch(err => {
      alert(`Error: ${err}`)
    })
  }

  React.useEffect(async () => {
    const data = await axios.get(config.BASE_URL+'/admin/users',
    {
      headers: {
        'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
      }
    })
      .then(res => {
        setRows(res.data.data.map((user, idx) => {
          return {...user, id: idx+1}
        }))
        setMaxStorages(res.data.data.map(user => {
          return user.max_storage / 1000
        }))
        console.log(res)
      }).catch(err => {
        console.log(err)
        setRows([])
      })
  },[])
  return (
    <div style={{padding: '1%', width: '100%', maxHeight: '100vh', overflowY: 'scroll'}}>
      <h1>Users</h1>
      <div style={{width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns(maxStorages, setMaxStorages)}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
    </div>
  );
}