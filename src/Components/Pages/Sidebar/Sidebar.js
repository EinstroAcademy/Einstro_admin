import React from 'react'
import { Link } from 'react-router-dom';
import './sidebar.css'
import logo from '../../../Images/login/Einstro Logo.png'
import dashboard from '../../../Images/icons/dashboard.svg'
import study from '../../../Images/icons/study.svg'
import note from '../../../Images/icons/blog.svg'
import course from '../../../Images/icons/course.svg'

export const SidebarData=[
  {
    link:'/dashboard',
    name:'Dashboard',
    img:dashboard,
    id:'dashboard'
  },
  {
    link:'/abroad',
    name:'Study Abroad',
    img:study,
    id:'abroad'
  },
  {
    link:'/blog',
    name:'Blog',
    img:note,
    id:'blog'
  },
  {
    link:'/course',
    name:'Course',
    img:course,
    id:'blog'
  },
]

function Sidebar() {
  
  return (
    <>
    <div className={`sidebar-top`}>
        <div className="logo">
          <img
            src={logo}
            className={"small"}
            alt="Logo"
          />
        </div>
      </div>
    <section className={`sidebar`}>
    <ul className="sidebar-menu">
      {SidebarData.map((item) => {
        return (
          <>
            <Link to={item.link} className="sb-link">
              <li>
                <img src={item.img}/>
                <span>{item.name}</span>
              </li>
            </Link>
          </>
        );
      })}
    </ul>
  </section>
    </>
  )
}

export default Sidebar