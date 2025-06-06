import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css'
import logo from '../../../Images/login/Einstro Logo.png'
import dashboard from '../../../Images/icons/dashboard.svg'
import study from '../../../Images/icons/study.svg'
import note from '../../../Images/icons/blog.svg'
import course from '../../../Images/icons/course.svg'
import { SidebarData } from './SidebarData';



function Sidebar() {
   const [sidebarMenu, setSidebarMenu] = useState([]);
  const [activeMenu, setActiveMenu] = useState("");
  const location = useLocation();

  useEffect(() => {
    setSidebarMenu(SidebarData);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const active = SidebarData.find((item) =>
      currentPath.startsWith(item.link)
    );
    if (active) {
      setActiveMenu(active.id);
    }
  }, [location]);
  return (
    <>
    <div className={`sidebar-top`}>
        <div className="logo">
          
        </div>
      </div>
    <section className={`sidebar`}>
    <ul className="sidebar-menu">
      {SidebarData.map((item) => {
        return (
          <>
            <Link to={item.link} className="sb-link">
              <li
              title={item?.navItem}
                  onClick={() => setActiveMenu(item.id)}
                  >
                <div className={`side-menu-box ${item.id === activeMenu ? "active" : ""}`}>

                <img src={item.img}/>
                </div>
                {/* <span>{item.name}</span> */}
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