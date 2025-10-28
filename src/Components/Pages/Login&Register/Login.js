import React, { useState } from 'react'
import loginImg from '../../../Images/login/login.png'
import logo from "../../../Images/home/studytezorg.png";
import './login.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { updateLoginData } from '../../../redux/login/login'
import { jwtDecode } from 'jwt-decode'
import { NodeURL } from '../../../api/api'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login,setLogin]=useState({
    email:"",
    password:""
  })
  const handleChange =(e)=>{
    setLogin({...login,[e.target.name]:e.target.value})
  }

  const OnLogin = ()=>{
    if(login.email===""){
      return toast.error("Email Required")
    }
    if(login.password===""){
      return toast.error("Password Required")
    }

    axios.post(`${NodeURL}/admin/login`,login).then((res)=>{
      if(res.data.status===1){
        toast.success("Welcome!")
        const decodeToken = jwtDecode(res.data.token);
        dispatch(updateLoginData({...decodeToken,token:res.data.token}))
        localStorage.setItem('ESA-admin',res.data.token)
        localStorage.setItem('adminData',JSON.stringify({...decodeToken,token:res.data.token}))
        navigate('/dashboard')
      }
      if(res.data.status===0){
        toast.error(res.data.message)
      }
    })
  }
  return (
    <div className="container-fluid">
      <div className="container my-5">
        <div className="row">
          <div className="col-6">
            <div>
              <img src={loginImg} className="img-fluid" />
            </div>
          </div>
          <div className="col-6">
            <div className="container mt-5">
              <div className="text-center">
                <img src={logo} className="logo-img" />
              </div>
              <div className="text-center font-semi code-red">
                <h4>Login</h4>
              </div>
              <div className="container w-75 m-auto">
                <div className="mt-3">
                  <label className="font-semi code-red">Email Address</label>
                  <div>
                    <input
                      type="email"
                      className="login-input"
                      name="email"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="font-semi code-red">Password</label>
                  <div>
                    <input
                      type="password"
                      className="login-input"
                      name="password"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                <div className="text-end mt-3">
                  <a
                    className="font-semi code-red"
                    onClick={() => navigate("/forgot/password")}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="mt-3">
                  <button className="login-btn" onClick={() => OnLogin()}>
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='copy-ryt'>
        © Einstro - Studytez {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default Login