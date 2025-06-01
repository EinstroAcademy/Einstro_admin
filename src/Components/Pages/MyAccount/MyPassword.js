import React, { useState } from 'react'
import toast from 'react-hot-toast'
import request from '../../../api/api'
import { useSelector } from 'react-redux'

function MyPassword() {
    const [isEdit,setIsEdit]= useState(false)
    const admin = useSelector((state)=>state.admin.admin)
    const [changePassword,setChangePassword]=useState({
        oldPassword:'',
        newPassword:'',
        confirmPassword:'',
        isOldPassword:false,
        isNewPassword:false,
        isConfirmPassword:false
    })

    const showPassword=(key,value)=>{
        if(key==='oldPassword'){
            setChangePassword({...changePassword,isOldPassword:value})
        }
        if(key==='newPassword'){
            setChangePassword({...changePassword,isNewPassword:value})
        }
        if(key==='confirmPassword'){
            setChangePassword({...changePassword,isConfirmPassword:value})
        }
    }

    const handleChange=(name,value)=>{
      setChangePassword({...changePassword,[name]:value})
    }

    const updatePassword =()=>{
      const {oldPassword,newPassword,confirmPassword}=changePassword
      if(oldPassword===""){
        return toast.error("Old Password Required")
      }
      if(newPassword===""){
        return toast.error("New Password Required")
      }
      if(confirmPassword===""){
        return toast.error("Confirm Password Required")
      }

      request({
        url:'admin/change/password',
        method:'POST',
        data:{...changePassword,adminId:admin.id}
      }).then((res)=>{
        if(res.status===1){
          toast.success("Password Changes Successfully")
          setIsEdit(false)
          setChangePassword({
            oldPassword:'',
            newPassword:'',
            confirmPassword:'',
            isOldPassword:false,
            isNewPassword:false,
            isConfirmPassword:false
          })
        }
        if(res.status===0){
          toast.error(res.message)
        }
      })
    }
  return (
    <div className='container w-50 m-0'>
         <div className="row">
            <div className="col-12 mt-4">
              <label className="font-semi code-red">Old Password</label>
              <div className='admin_password'>
                <input
                  type={changePassword.isOldPassword ?"text":"password"}
                  className="login-input"
                  disabled={!isEdit}
                  value={changePassword.oldPassword}
                    onChange={(e) => handleChange('oldPassword',e.target.value)}
                />
                {
                    changePassword.isOldPassword ?
                    <i class="fa fa-eye" aria-hidden="true" onClick={()=>showPassword('oldPassword',false)}></i>:
                    <i class="fa fa-eye-slash" aria-hidden="true" onClick={()=>showPassword('oldPassword',true)}></i>
                }
              </div>
            </div>
            <div className="col-12 mt-4" >
              <label className="font-semi code-red">New Password</label>
              <div className='admin_password'>
                <input
                  type={changePassword.isNewPassword ?"text":"password"}
                  className="login-input"
                  disabled={!isEdit}
                  value={changePassword.newPassword}
                  onChange={(e) => handleChange('newPassword',e.target.value)}
                />
                {
                    changePassword.isNewPassword ?
                    <i class="fa fa-eye" aria-hidden="true" onClick={()=>showPassword('newPassword',false)}></i>:
                    <i class="fa fa-eye-slash" aria-hidden="true"  onClick={()=>showPassword('newPassword',true)}></i>
                }
              </div>
            </div>
            <div className="col-12 mt-4">
              <label className="font-semi code-red">Confirm Password</label>
              <div className='admin_password'>
                <input
                   type={changePassword.isConfirmPassword ?"text":"password"}
                  className="login-input"
                  disabled={!isEdit}
                  value={changePassword.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword',e.target.value)}
                />
               {
                    changePassword.isConfirmPassword ?
                    <i class="fa fa-eye" aria-hidden="true"  onClick={()=>showPassword('confirmPassword',false)}></i>:
                    <i class="fa fa-eye-slash" aria-hidden="true"  onClick={()=>showPassword('confirmPassword',true)}></i>
                }
              </div>
            </div>
          </div>
          {isEdit ? (
            <button className="profile_save_btn" onClick={()=>updatePassword()}>Save Changes</button>
          ) : (
            <button className="profile_edit_btn" onClick={()=>setIsEdit(!isEdit)}>Edit Password</button>
          )}
    </div>
  )
}

export default MyPassword