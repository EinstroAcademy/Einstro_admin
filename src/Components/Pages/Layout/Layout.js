import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Topbar from '../Topbar/Topbar'
import './layout.css'

function Layout(props) {
  return (
    <main className="main-container">
      <Sidebar/>
      <Topbar/>
      <section className="main-section">{props.children}</section>
    </main>
  )
}

export default Layout