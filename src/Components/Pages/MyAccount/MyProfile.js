import React, { useEffect, useState } from "react";
import "./myaccount.css";
import { useSelector } from "react-redux";
import request, { NodeURL } from "../../../api/api";
import toast from "react-hot-toast";
import profile from '../../../Images/icons/profile.svg'

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateMobile = (number) => {
  const pattern = /^[6789]\d{9}$/;
  return pattern.test(number);
};

function MyProfile() {
  const [isEdit, setIsEdit] = useState(false);
  const admin = useSelector((state)=>state.admin.admin)
  const [selectedImage, setSelectedImage] = useState(null);

  console.log(admin)

  const [adminData,setAdminData]=useState({
    username:'',
    email:'',
  })

  const fetchAdminDetails =()=>{
      request({
        url:'/admin/details',
        method:'POST',
        data:{adminId:admin.id}
      }).then((res)=>{
        if(res.status===1){
          setAdminData(res.response)
        }
        if(res.status===0){
          console.log(res)
        }
      }).catch((err)=>{
        console.log(err)
      })
  }

  useEffect(()=>{
    if(admin.id){
      fetchAdminDetails()
    }
  },[admin])

  const handleChange=(name,value)=>{
    setAdminData({...adminData,[name]:value})
  }

  const updateAdmin=()=>{
    if(adminData.username===""){
      return toast.error('Admin Username Required')
    }
    if(adminData.email===""){
      return toast.error('Admin Email Required')
    }

    if(!validateEmail(adminData.email)){
      return toast.error('Invalid Email')
    }
    if(adminData.mobile===""){
      return toast.error('Admin Mobile Required')
    }
    if(!validateMobile(adminData.mobile)){
      return toast.error('Invalid Mobile')
    }

    request({
      url:'/admin/update/details',
      method:'POST',
      data:{...adminData,adminId:admin.id}
    }).then((res)=>{
      if(res.status===1){
        setIsEdit(false)
        toast.success("Updated Successfully")
        fetchAdminDetails()
      }
      if(res.status===0){
        console.log(res)
      }
    }).catch((err)=>{
      console.log(err)
    })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      var imageUrl = URL.createObjectURL(file)
      setSelectedImage({image:file,imageUrl,adminId:admin.id});
    }

    let obj ={image:file,imageUrl,adminId:admin.id}
    if(adminData.image!==""){
      obj.oldImage=adminData.image
    }

    const formData = new FormData()
    

    Object.entries(obj).forEach(([key, value]) => {
      formData.append(key, value);
    });

    request({
      url:'/admin/profile/image/update',
      method:'POST',
      data:formData
    }).then((res)=>{
      if(res.status===1){
        setIsEdit(false)
        fetchAdminDetails()
        toast.success('Profile Pic Updated')
        setSelectedImage({})
      }
      if(res.status===0){
        toast.error(res.message)
      }
    })

  };

  const handleRemovePic =()=>{
    request({
      url:'/admin/profile/remove/image',
      method:'POST',
      data:{adminId:admin.id,oldImage:adminData.image}
    }).then((res)=>{
      if(res.status===1){
        toast.success("Photo Removed")
        fetchAdminDetails()
      }
      if(res.status===0){
        toast.error(res.message)
      }
    })
  }
  return (
    <div className="container">
      <div className="profile">
        <div className="profile-img-box">
          {
           adminData.image ?<img className="profile-img" src={`${NodeURL}/${adminData.image}`} />:selectedImage?.imageUrl?<img className="profile-img" src={`${selectedImage.imageUrl}`}/>:<img className="profile-img" src={profile} />
          }
          
          <button className="change_img_btn position-relative">Change Image
          <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />
          </button>
          <button className="remove_img_btn" onClick={()=>handleRemovePic()}>Remove Image</button>
        </div>
        <div className="container p-0 w-75 m-0">
          <div className="row">
            <div className="col-6">
              <label className="font-semi code-red">Username</label>
              <div>
                <input
                  type="text"
                  className="login-input"
                  name="username"
                  value={adminData.username}
                  disabled={!isEdit}
                  // value={newBlog.title}
                    onChange={(e) => handleChange('username',e.target.value)}
                />
              </div>
            </div>
            <div className="col-6">
              <label className="font-semi code-red">Email</label>
              <div>
                <input
                  type="text"
                  className="login-input"
                  name="username"
                  value={adminData.email}
                  disabled={!isEdit}
                  // value={newBlog.title}
                    onChange={(e) => handleChange('email',e.target.value)}
                />
              </div>
            </div>
            <div className="col-6 mt-4">
              <label className="font-semi code-red">Mobile</label>
              <div>
                <input
                  type="text"
                  className="login-input"
                  name="username"
                  disabled={!isEdit}
                  value={adminData.mobile}
                    onChange={(e) => handleChange('mobile',e.target.value)}
                />
              </div>
            </div>
          </div>
          {isEdit ? (
            <button className="profile_save_btn" onClick={()=>updateAdmin()}>Save Changes</button>
          ) : (
            <button className="profile_edit_btn" onClick={()=>setIsEdit(!isEdit)}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
