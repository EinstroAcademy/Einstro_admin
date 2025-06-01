import React, { useEffect } from 'react'
import Layout from '../Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { checkLogin } from '../../../redux/login/login'

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
            Dashboard
        </section>
    </Layout>
  )
}

export default Dashboard