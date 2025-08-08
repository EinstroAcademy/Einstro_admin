import React, { useEffect } from 'react'
import Layout from '../Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { checkLogin } from '../../../redux/login/login'
import './dashboard.css';

function Dashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const admin = useSelector((state) => state?.admin?.admin)
    console.log(admin)


    useEffect(() => {
        if (!admin?.id || !admin?.token) {
            navigate('/');
          }
      }, [admin]);
    
    
  return (
    <Layout>
        <section>
            <div className="dashboard-cards-row">
                <div className="dashboard-card user-card">
                    <div className="card-title">User Count</div>
                    <div className="card-count">120</div>
                </div>
                <div className="dashboard-card blog-card">
                    <div className="card-title">Blog Count</div>
                    <div className="card-count">45</div>
                </div>
                <div className="dashboard-card university-card">
                    <div className="card-title">University Count</div>
                    <div className="card-count">12</div>
                </div>
                <div className="dashboard-card course-card">
                    <div className="card-title">Course Count</div>
                    <div className="card-count">30</div>
                </div>
            </div>
        <div className="dashboard-activity-row">
                <div className="dashboard-activity-col">
                    <div className="activity-title">User Activity</div>
                    <ul className="activity-list">
                        <li><span className="activity-user">John Doe</span> logged in <span className="activity-time">2 min ago</span></li>
                        <li><span className="activity-user">Jane Smith</span> updated profile <span className="activity-time">10 min ago</span></li>
                        <li><span className="activity-user">Alex Lee</span> logged out <span className="activity-time">15 min ago</span></li>
                    </ul>
                </div>
                <div className="dashboard-activity-col">
                    <div className="activity-title">University Recent Search</div>
                    <ul className="activity-list">
                        <li><span className="activity-university">Harvard University</span> <span className="activity-time">5 min ago</span></li>
                        <li><span className="activity-university">MIT</span> <span className="activity-time">12 min ago</span></li>
                        <li><span className="activity-university">Stanford</span> <span className="activity-time">20 min ago</span></li>
                    </ul>
                </div>
                            </div>
        </section>
    </Layout>
  )
}

export default Dashboard