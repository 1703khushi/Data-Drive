import './App.css';
import Header from './components/header'
import Sidebar from './components/sidebar'
import AdminSidebar from './components/AdminSidebar'
import AdminDashboard from './components/AdminDashboard'
import FilesView from './components/filesView/FilesView'
import SideIcons from './components/sideIcons'
import { Routes, Route } from "react-router-dom";
import LoginForm from './components/auth/login';
import Invites from './components/shared_me/invites';
import ImageViewer from './components/Viewers/ImageViewer';
import LinkPage from './components/linksPages/linkPage';


import GDriveLogo from './media/google-drive-logo.png'

// import { auth, provider } from "./firebase";
import { useEffect, useState, createContext } from 'react';
import Accepted from './components/shared_me/Accepted';

function App() {
  const [user, setUser] = useState(localStorage.getItem('Login'))
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminDashboard, setAdminDashboard] = useState(false)
  const [adminpanel, setAdminDashPanel] = useState(0)
  const [storage, setStorage] = useState([0,0])
  const [folders, setFolders] = useState(JSON.parse(localStorage.getItem('folders')))
  const [search, setSearch] = useState('')

  useEffect(() => {
    console.log("app")
    let admin = JSON.parse(localStorage.getItem('dfs-user'))?.user['user_role']
    if(admin == 'admin'){
      setIsAdmin(true)
    }
    if(localStorage.getItem('folders') == undefined)
    {
      setFolders([{folder: 'My Drive', id: ''}])
      localStorage.setItem('folders', [JSON.stringify([{folder: 'My Drive', id: ''}])])
    }

  },[user])

  const Header_component = () => {
    return (
      <Header 
        user = {user} 
        setUser = {setUser} 
        isAdmin={isAdmin}
        adminDashboard = {adminDashboard}
        setAdminDashboard = {setAdminDashboard}
        search={search}
        setSearch={setSearch}
      />
    )
  }

  const Sidebar_component = () => {
    return (
      <Sidebar 
        storage = {storage}
        folders={folders}
        setFolders={setFolders}
      />
    )
  }

  return (
    <div className="app">
      {
        user == "true" ? (
          <>
            {adminDashboard == false
              ?<Routes>
                  <Route path='/' element={
                    <>
                      {Header_component()}
                      <div className="app__main">
                        {Sidebar_component()}
                        <FilesView 
                        setStorage = {setStorage} 
                        folders = {folders}
                        setFolders = {setFolders}
                        search={search}
                        />
                        <SideIcons />
                      </div>
                    </>
                  } />
                  <Route path='/:id' element={
                    <>
                      {Header_component()}
                      <div className="app__main">
                        {Sidebar_component()}
                        <FilesView 
                        setStorage = {setStorage} 
                        folders = {folders}
                        setFolders = {setFolders}
                        search={search}
                        />
                        <SideIcons />
                      </div>
                    </>
                  } />
                  <Route path='/shared/invites' element={
                    <>
                      {Header_component()}
                      <div className="app__main">
                        {Sidebar_component()}
                        <Invites />
                        <SideIcons />
                      </div>
                    </>
                } />
                <Route path='/shared' element={
                    <>
                      {Header_component()}
                      <div className="app__main">
                        {Sidebar_component()}
                        <Accepted search={search}/>
                        <SideIcons />
                      </div>
                    </>
                } />
                <Route path='/shared/:id' element={
                    <>
                      {Header_component()}
                      <div className="app__main">
                        {Sidebar_component()}
                        <Accepted search={search}/>
                        <SideIcons />
                      </div>
                    </>
                } />
                <Route path='/view/:id/:file' element={
                  <ImageViewer />

                } />
                <Route path='/link/:id/:file/:access' element={
                  <LinkPage 
                    user={user} 
                    setUser = {setUser} 
                    setIsAdmin = {setIsAdmin}
                    setAdminDashboard = {setAdminDashboard}
                  />
                } />
                </Routes>
              :
              <>
              {Header_component()}
              <div className="app__main">
                <AdminSidebar 
                  adminpanel = {adminpanel}
                  setAdminDashPanel = {setAdminDashPanel}
                />
                <AdminDashboard
                  adminpanel = {adminpanel}
                  setAdminDashPanel = {setAdminDashPanel}
                />
              </div>
              </>
            }
          </>
        ) : (
          <Routes>
          <Route path='/link/:id/:file/:access' element={
            <LinkPage 
              user={user} 
              setUser = {setUser} 
              setIsAdmin = {setIsAdmin}
              setAdminDashboard = {setAdminDashboard}
            />
          } />
          <Route path='/*' element={
            <>
              <Header user={user} setUser = {setUser} isAdmin = {isAdmin}/>
              <LoginForm 
              user={user} 
              setUser = {setUser} 
              setIsAdmin = {setIsAdmin}
              setAdminDashboard = {setAdminDashboard} 
              />
            </>
          } />
          </Routes>
          
        )
      }
    </div>
  )
}


export default App;
