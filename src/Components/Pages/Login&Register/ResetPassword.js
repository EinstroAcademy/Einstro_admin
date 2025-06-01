import React, { useState } from 'react'
import logo from '../../../Images/login/Einstro Logo.png'
import resetImg from '../../../Images/login/Reset password.png'
import './login.css'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { NodeURL } from '../../../api/api'

function ResetPassword() {
    const location = useLocation()
  const navigate =useNavigate()
  const [reset,setReset]= useState({
    email: location?.state?.email || '',
    newPassword:"",
    confirmPassword:""
  })

  const resetPassword = ()=>{
    if(reset.newPassword===""){
      return toast.error("New Password Required")
    }
    if(reset.confirmPassword===""){
      return toast.error("confirm Password Password Required")
    }
    if(reset.newPassword!==reset.confirmPassword){
      return toast.error("Password doesn't Match")
    }

    axios.post(`${NodeURL}/admin/reset/password`,reset).then((res)=>{
      if(res.data.status===1){
        toast.success(res.data.message)
        navigate('/')
      }
      if(res.data.status===2){
        toast.error(res.data.message)
        navigate('/forgot/password')
      }
      if(res.data.status===0){
        toast.error(res.data.message)
      }
    })
  }
  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row">
          <div className="col-6">
            <div>
              <img src={resetImg} className="img-fluid" />
            </div>
          </div>
          <div className="col-6">
            <div className="container mt-5">
              <div className="text-center">
                <img src={logo} className="logo-img" />
              </div>
              <div className="text-center font-semi code-red">
                <h4>Reset Password</h4>
              </div>
              <div className="container w-75 m-auto">
                <div className="mt-3">
                  <label className="font-semi code-red">New Password</label>
                  <div>
                    <input
                      type="email"
                      className="login-input"
                      name="newPassword"
                      onChange={(e) =>
                        setReset({ ...reset, newPassword: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="font-semi code-red">Confirm Password</label>
                  <div>
                    <input
                      type="password"
                      className="login-input"
                      name="confirmPassword"
                      onChange={(e) =>
                        setReset({ ...reset, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                </div>
                {/* <div className='text-end mt-3'>
                    <a className='font-semi code-red'>Forgot Password?</a>
                </div> */}
                <div className="mt-3">
                  <button className="login-btn" onClick={()=>resetPassword()}>Reset Password</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword