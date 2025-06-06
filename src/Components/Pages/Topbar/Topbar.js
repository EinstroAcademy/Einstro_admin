import React from 'react'
import './topbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import profile from '../../../Images/icons/profile.png'
import dropdown from '../../../Images/icons/dropdown.png'
import { useDispatch } from 'react-redux'
import { logout } from '../../../redux/login/login'
import toast from 'react-hot-toast'
import { SidebarData } from '../Sidebar/Sidebar'


import logo from '../../../Images/login/Einstro Logo.png'

function Topbar() {
  const dispatch=useDispatch()
  const navigate=useNavigate('/')
  const location = useLocation()
  const logOut =()=>{
    localStorage.removeItem('adminData')
    dispatch(logout)
    navigate('/')
    toast.success("Logout Successfully")
  }
  return (
    <nav className="header" role="navigation">
    <div className="header-left">
      <h6 className="nav-title">
        <img
            src={logo}
            className={"small"}
            alt="Logo"
          />
       {/* {SidebarData.find((list)=>list.link===location.pathname)?.name} */}
      </h6>
    </div>
    <div className="header-right">
      {/* <div className="header-icon">
        <img src={messageIcon} alt="Message" />
      </div> */}
      {/* <div className="header-icon">
        <img src={bellIcon} alt="Notification" />
      </div> */}

      <span >
        
      </span>
      <div className="header-profile">
        <div className="d-flex align-items-center gap-2">
         
                <img
                  src={profile}
                  className="profile-img"
                  alt="Profile"
                />
          {/* <img src={dropdown} alt="Dropdown" /> */}
        </div>
        <ul className="header-profile-dropdown">
          <Link to={"/my/account"}>
            <li>My Profile</li>
          </Link>
          {/* <li>Manage Address</li> */}
          <li className="logout" onClick={()=>logOut()}>
            Logout
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}

export default Topbar