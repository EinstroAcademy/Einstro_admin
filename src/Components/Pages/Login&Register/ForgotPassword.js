import React, { useState } from 'react'
import logo from '../../../Images/login/Einstro Logo.png'
import forgot from '../../../Images/login/Forgot password.png'
import './login.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { NodeURL } from '../../../api/api'

function ForgotPassword() {
    const navigate = useNavigate()
   const [email,setEmail]=useState('')

   const sendOtp = ()=>{
    if(email===""){
      return toast.error("Email Required")
    }
    axios.post(`${NodeURL}/admin/forgot/password`,{email:email}).then((res)=>{
      if(res.data.status===1){
         toast.success(res.data.message)
         navigate('/verify/otp',{state:{email:email}})
      }
      if(res.data.status===0){
        toast.error(res.data.message)
      }
    }).catch((err)=>console.log(err))
   }
  return (
   <section>
    <div className="container-fluid">
      <div className="container">
        <div className="row">
          <div className="col-6">
            <div>
              <img src={forgot} className="img-fluid" />
            </div>
          </div>
          <div className="col-6">
            <div className="container mt-5">
              <div className="text-center">
                <img src={logo} className="logo-img" />
              </div>
              <div className="text-center font-semi code-red">
                <h4>Forgot Password</h4>
              </div>
              <div className="container w-75 m-auto">
                <div className="mt-3">
                  <label className="font-semi code-red">Email Address</label>
                  <div>
                    <input type="email" className="login-input" name="email" onChange={(e)=>setEmail(e.target.value)}/>
                  </div>
                </div>
                {/* <div className="mt-3">
                  <label className="font-semi code-red">Password</label>
                  <div>
                    <input type="password" className="login-input" />
                  </div>
                </div> */}
                {/* <div className='text-end mt-3'>
                    <a className='font-semi code-red'>Forgot Password?</a>
                </div> */}
                <div className="mt-3">
                  <button className='login-btn' onClick={()=>sendOtp()}>Send OTP</button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
   </section>
  )
}

export default ForgotPassword