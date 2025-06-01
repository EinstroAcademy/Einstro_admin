import React, { useState } from 'react'
import logo from '../../../Images/login/Einstro Logo.png'
import Otp from '../../../Images/login/Enter OTP.png'
import './login.css'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { NodeURL } from '../../../api/api'

function VerifyOtp() {
    const location = useLocation()//state,path
  const navigate= useNavigate()
  const [otp,setOtp]=useState("")

  const MaskedEmail = ({ email }) => {
    const maskEmail = (email) => {
      const [localPart, domainPart] = email.split('@');
      const maskLength = Math.max(1, Math.min(5, localPart.length - 2)); // Mask at least 1 and at most 5 characters
      const maskedLocalPart = localPart[0] + 'x'.repeat(maskLength) + localPart.slice(maskLength + 1);
      return `${maskedLocalPart}@${domainPart}`;
    };
  
    return (
      <div className='text-success'>
        <p>Otp sent to Your email: {maskEmail(email)}</p>
      </div>
    );
  };

  const verifyOtp =()=>{
    if(otp===""){
      return toast.error("OTP required")
    }
    if(otp.length<4){
      return toast.error("Invalid OTP")
    }
    axios.post(`${NodeURL}/admin/verify/otp`,{email:location?.state?.email,otp:otp}).then((res)=>{
      if(res.data.status===1){
        toast.success(res.data.message)
        navigate('/reset/password',{state:{email:location?.state?.email}})
      }
      if(res.data.status===0){
        toast.error(res.data.message)
      }
      if(res.data.status===2){
        toast.error(res.data.message)
        navigate('/forgot/password')
      }
    })
  }
  return (
    <section>
      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <div>
                <img src={Otp} className="img-fluid" />
              </div>
            </div>
            <div className="col-6">
              <div className="container mt-5">
                <div className="text-center">
                  <img src={logo} className="logo-img" />
                </div>
                {/* <div className="text-center font-semi code-red">
                <h4>Enter OTP</h4>
              </div> */}
                <div className="container w-75 m-auto">
                  <MaskedEmail  email={location?.state?.email}/>
                  <div className="mt-3">
                    <label className="font-semi code-red">OTP</label>
                    <div>
                      <input
                        type="text"
                        className="login-input"
                        name="otp"
                        onChange={(e) => setOtp(e.target.value)}
                      />
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
                    <button className="login-btn" onClick={()=>verifyOtp()}>Verify OTP</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerifyOtp