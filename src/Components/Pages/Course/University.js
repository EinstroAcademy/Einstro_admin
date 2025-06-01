import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader, Popover, PopoverBody, PopoverHeader, Table } from 'reactstrap'
import request, { NodeURL } from '../../../api/api';
import { debounce, truncate } from 'lodash';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { countryOptions, customStyles } from './Course';
import Tinymce from '../../Tinymce/Tinymce';
import closeIcon from '../../../Images/icons/red-x-icon (1).png'
import './university.css'


export const currencyOption =[
  {
    label:'UK',
    value:{
        code: "GBP",
        symbol: "£",
        name: "British Pound",
        country:'UK'
    },
  },
  {
    label:'USA',
    value:{
      code: "USD",
      symbol: "$",
      name: "US Dollar",
        country:'USA'
    },
  },
  {
    label:'Australia',
    value:{
      code: "AUD",
      symbol: "A$",
      name: "Australian Dollar",
        country:'Australia'
    },
  },
  {
    label:'Canada',
    value:{
      code: "CAD",
      symbol: "C$",
      name: "Canadian Dollar",
        country:'Canada'
    },
  },
  {
    label:'Germany',
    value:{
      code: "AUD",
      symbol: "A$",
      name: "Australian Dollar",
        country:'Germany'
    },
  },
  {
    label:'France',
    value:{
      code: "EUR",
      symbol: "€",
      name: "Euro",
      country:'France'
    },
  },
  {
    label:'Ireland',
    value:{
      code: "EUR",
      symbol: "€",
      name: "Euro",
      country:'Ireland'
    },
  },

]

function University() {
  const [pages, setpages] = useState("");
  const [activePage, setactivePage] = useState(1);
  const [currPage, setcurrPage] = useState(25);
  const [pageRangeDisplayed, setpageRangeDisplayed] = useState(4);
  const [list, setList] = useState([]);
  const [isUniversity,setIsUniversity]= useState(false)
  const [selectedImages,setSelectedImages]= useState([])
  const[deleteId,setDeleteId]= useState('')
  const [finalFiles,setFinalFiles]=useState({
    images:[]
  })
  const [newUniversity,setNewUniversity]=useState({
      name:'',
      location:'',
      currency:{
        code:'',
        symbol:'',
        name:'',
        country:''
      },
      images:[],
      newImages:[],
      details:'',
      students:'',
      costOfLiving:'',
      rank:'',
      removedImages:[],
      cost:'',
      scholarship:'',
      requirements:''
  })
  const [tableOption, setTableOption] = useState({
      search: "",
      skip: 0,
      limit: 25,
      fromDate: "",
      toDate: "",
    });
  
    const getAllUniversityList = () => {
      request({
        url: "/admin/university/list",
        method: "POST",
        data: tableOption,
      }).then((res) => {
        if (res.status === 1) {
          setList(res.response.result);
          setpages(res.response.fullcount);
          setcurrPage(res.response.length);
        }else if (res && +res.status === 0) {
            setList(res.response.result);
            setpages(res.response.fullcount);
            setcurrPage(res.response.length);
          }
      });
    };

    useEffect(() => {
      getAllUniversityList();
    }, [tableOption]);

    const search = debounce((value) => {
      setTableOption({ ...tableOption, search: value });
    }, 500);

    const paginate = (data) => {
      const limit = tableOption.limit;
  
      if (data) {
        setactivePage(data);
        setcurrPage(limit);
        setTableOption((state) => {
          return {
            ...state,
            page: {
              current: data,
              history: data,
            },
            skip: data * limit - limit,
          };
        });
      }
    };

    const handleChange=(e)=>{
      const {name,value}=e.target;
      setNewUniversity({
          ...newUniversity,
          [name]:value
      })
    }

    const onSubmitBlog =()=>{
      const {name,location,country,currency,rank,costOfLiving,students,details}=newUniversity

      if (name === "") {
        return toast.error("Name required");
      }
      if (location === "") {
        return toast.error("Location required");
      }
      if (country === "") {
        return toast.error("country required");
      }
      if (currency === "") {
        return toast.error("currency required");
      }
      if (rank === "") {
        return toast.error("rank required");
      }
      if (costOfLiving === "") {
        return toast.error("costOfLiving required");
      }
      if (students === "") {
        return toast.error("students required");
      }
      if (details === "") {
        return toast.error("details required");
      }
      // toast.loading("Processing");
      const formData = new FormData();
     
      newUniversity.currency=JSON.stringify(newUniversity.currency)

      Object.entries(newUniversity).forEach(([key, value]) => {
        formData.append(key, value);
        if (key === "images") {
          value.map((e) => {
            formData.append(key, e);
          });
        }
      });
     
      request({
          url:'/admin/create/university',
          method:'POST',
          data:formData,
      }).then((res)=>{
          if(res.status===1){
              toast.success("University created successfully")
              setIsUniversity(!isUniversity)
              setNewUniversity({
                  name:"",
              })
              getAllUniversityList()
          }
          if(res.status===0){
              toast.error(res.message)
          }
      })
    }

    const editUniversity=(data)=>{
      console.log(data)
      setNewUniversity(data)
      setIsUniversity(!isUniversity)
    }

    const handleEditBlog=()=>{
      const {name,_id}=newUniversity

      if(name===""){
          return toast.error("Name required")
      }
      
      request({
          url:'/admin/update/university',
          method:'POST',
          data:newUniversity,
      }).then((res)=>{
          if(res.status===1){
              toast.success("University Updated successfully")
              setIsUniversity(!isUniversity)
              setNewUniversity({
                  name:"",
              })
              getAllUniversityList()
          }
          if(res.status===0){
              toast.error(res.message)
          }
      })
    }

    const onDelete=(id)=>{
      setDeleteId(id)
  }

  const deleteSubject=(e,item)=>{
      e.stopPropagation()
      request({
          url:'/admin/university/remove',
          method:'POST',
          data:{universityId:item._id}
      }).then((res)=>{
          if(res.status===1){
              toast.success("University Deleted successfully")
              setDeleteId('')
              getAllUniversityList()
          }
          if(res.status===0){
              toast.error(res.message)
          }
      })
  }

  const handleImageUpload = (event) => {
    const selectedFiles = event.target.files;
    //Image size 1mb
    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].size > 1048576) {
        toast.error("Maximum Image Size 1mb each photo");
        return;
      }
    }
    if (selectedFiles.length > 10) {
      toast.error("Maximum upload 10 Images");
      return;
    }
    const selectedFilesArray = Array.from(selectedFiles);
    setFinalFiles({ images: selectedFilesArray });
    if(newUniversity._id){
      setNewUniversity({ ...newUniversity, newImages:[...(newUniversity.newImages || []),...selectedFilesArray] });
    }else{
      setNewUniversity({ ...newUniversity, images: selectedFilesArray });
    }
    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setSelectedImages((previousImages) => previousImages.concat(imagesArray));
  };

  const closeUniversity=()=>{
    setIsUniversity(!isUniversity)
    setNewUniversity({
      name:'',
      location:'',
      currency:{
        code:'',
        symbol:'',
        name:'',
        country:''
      },
      images:[],
      details:'',
      students:'',
      costOfLiving:'',
      rank:''
  })
  }

  const removeImage=(indx)=>{
    let removedImages=newUniversity.images.splice(indx,1)
    setNewUniversity({
      ...newUniversity,
      removedImages
    })
  }
  const removeSelectedImage=(indx)=>{
    selectedImages.splice(indx,1)
    setSelectedImages([...selectedImages])
  }


  const onSubmitEditUni =()=>{
    const {name,location,country,currency,rank,costOfLiving,students,details,images,newImages,removedImages}=newUniversity

    if (name === "") {
      return toast.error("Name required");
    }
    if (location === "") {
      return toast.error("Location required");
    }
    if (country === "") {
      return toast.error("country required");
    }
    if (currency === "") {
      return toast.error("currency required");
    }
    if (rank === "") {
      return toast.error("rank required");
    }
    if (costOfLiving === "") {
      return toast.error("costOfLiving required");
    }
    if (students === "") {
      return toast.error("students required");
    }
    if (details === "") {
      return toast.error("details required");
    }
    const formData = new FormData();
     
    newUniversity.currency=JSON.stringify(newUniversity.currency)
    newUniversity.images=JSON.stringify(newUniversity.images)
    if(newUniversity?.removedImages?.length>0){
      newUniversity.removedImages=JSON.stringify(newUniversity.removedImages)
    }

    Object.entries(newUniversity).forEach(([key, value]) => {
      formData.append(key, value);
      if (key === "newImages") {
        value.map((e) => {
          formData.append(key, e);
        });
      }
    });

    request({
      url:'/admin/update/university',
      method:'POST',
      data:formData,
  }).then((res)=>{
      if(res.status===1){
          toast.success("University Updated successfully")
          setIsUniversity(!isUniversity)
          setNewUniversity({
            name:'',
            location:'',
            currency:{
              code:'',
              symbol:'',
              name:'',
              country:''
            },
            images:[],
            newImages:[],
            details:'',
            students:'',
            costOfLiving:'',
            rank:'',
            removedImages:[]
          })
          setSelectedImages([])
          getAllUniversityList()
      }
      if(res.status===0){
          toast.error(res.message)
      }
  })

  }
console.log(newUniversity)
  return (
    <div className="mybookings-table-wrap mt-4">
        <div className='text-end mb-3'>
          <button className="add_blog_btn"  onClick={()=>setIsUniversity(!isUniversity)}> Add University</button>
        </div>
        <Table borderless className={`mybookings-table`}>
          <thead style={{ "--bg-color": "#f3f5ff" }}>
            <tr style={{ "--text-color": "#8d9eff" }}>
              <th>S.No</th>
              <th>University Name</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {list.length <= 0 ? (
              <tr className="text-center">
                <td colSpan={12}>
                  <h6>No records available</h6>
                </td>
              </tr>
            ) : (
              list.map((item, idx) => {
                return (
                  <tr className="cursor-pointer">
                    <td >
                      {tableOption.skip + idx + 1}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.location}</td>
                    <td className="action-space">
                      {/* <span className="text-primary" >
                        <i class="fa fa-eye" aria-hidden="true"></i>
                      </span> */}
                      <span className="text-warning" onClick={()=>editUniversity(item)}>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                      </span>
                      <span className="action-btn" id={`deleteId-${idx}`} onClick={()=>onDelete(item._id)}>
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                      </span>
                      <Popover
                            placement="top"
                            isOpen={deleteId === item._id}
                            target={`deleteId-${idx}`}
                            id="delete-pop"
                          >
                            <PopoverHeader>Delete Confirmation</PopoverHeader>
                            <PopoverBody>
                              <h6 className="pb-2 text-muted" style={{ lineHeight: '1.4' }}>
                                Are you sure you want to permanently delete{' '}
                                <b className="text-dark">{item.title}</b>?
                              </h6>
                              <div className="d-flex align-items-center">
                                <button type="button" className='confirm_btn' title="Yes" onClick={(e) => deleteSubject(e,item)}>
                                  Delete
                                </button>
                                <button
                                    className='cancel_btn'
                                  type="button"
                                  title="No"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId('');
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </PopoverBody>
                          </Popover>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
        <Pagination
          prevPageText={<i class="fa fa-angle-left" aria-hidden="true"></i>}
          nextPageText={<i class="fa fa-angle-right" aria-hidden="true"></i>}
          firstPageText={
            <i class="fa fa-angle-double-left" aria-hidden="true"></i>
          }
          lastPageText={
            <i class="fa fa-angle-double-right" aria-hidden="true"></i>
          }
          activePage={activePage}
          itemsCountPerPage={currPage}
          totalItemsCount={pages}
          pageRangeDisplayed={pageRangeDisplayed}
          onChange={paginate}
          itemClass="page-item"
          linkClass="page-link"
          activeLinkClass="subject"
        />
          <Modal isOpen={isUniversity} toggle={()=>closeUniversity()} centered size='lg'>
        <ModalHeader>{newUniversity?._id?'Edit':'Add'} University</ModalHeader>
        <ModalBody>
          <div className="container-fluid">
            <div className="row">
              <div className="col-6">
                <label className="font-semi code-red">Name</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="name"
                    value={newUniversity.name}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Location</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="location"
                    value={newUniversity.location}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">International Students</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="students"
                    value={newUniversity.students}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Cost of Living</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="costOfLiving"
                    value={newUniversity.costOfLiving}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">World Rank</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="rank"
                    value={newUniversity.rank}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Country</label>
                <div>
                  <Select
                  styles={customStyles}
                    options={countryOptions}
                    value={countryOptions.filter((op)=>op.value===newUniversity?.country)}
                    onChange={(e)=>setNewUniversity({...newUniversity,country:e.value,currency:currencyOption.find((cur)=>cur.value.country===e.value).value})}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Currency</label>
                <div>
                  <Select
                  styles={customStyles}
                    options={currencyOption}
                    value={currencyOption.filter((op)=>op.value.country===newUniversity?.currency?.country)}
                    onChange={(e)=>setNewUniversity({...newUniversity,currency:e.value})}
                  />
                </div>
              </div>
              <div className="col-6 mt-3">
                <label className="font-semi code-red">Upload Image</label>
                <div>
                  <input
                    type="file"
                    className="login-input"
                    name="image"
                    multiple
                    onChange={(e) => handleImageUpload(e)}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className=''>
                {
                  newUniversity?.images && 
                  <div className='d-flex'>
                      {
                        newUniversity.images.map((img,indx)=>{
                          return <div className='uni-edit-img'>
                            <div className='uni-close-btn' onClick={()=>removeImage(indx)}><img src={closeIcon} className='cross'/></div>
                              <img className='uni-img' src={`${NodeURL}/${img}`}/>
                            </div>
                        })
                      }
                  </div>
                }
                {
                  selectedImages.length>0 && <div className='d-flex'>
                    {
                        selectedImages.map((img,indx)=>{
                          return <div className='uni-edit-img'>
                            <div className='uni-close-btn' onClick={()=>removeSelectedImage(indx)}><img src={closeIcon} className='cross'/></div>
                              <img className='uni-img' src={`${img}`}/>
                            </div>
                        })
                      }
                  </div>
                }
                </div>
                
              </div>
              <div className="col-12 mt-3">
                <label className="font-semi code-red">Details</label>
                <div>
                  <Tinymce content={newUniversity.details} handleEditorChange={(content) => setNewUniversity({...newUniversity,details:content})}/>
                </div>
              </div>
              <div className="col-12 mt-3">
                <label className="font-semi code-red">Cost</label>
                <div>
                  <Tinymce content={newUniversity.cost} handleEditorChange={(content) => setNewUniversity({...newUniversity,cost:content})}/>
                </div>
              </div>
              <div className="col-12 mt-3">
                <label className="font-semi code-red">Scholarship</label>
                <div>
                  <Tinymce content={newUniversity.scholarship} handleEditorChange={(content) => setNewUniversity({...newUniversity,scholarship:content})}/>
                </div>
              </div>
              <div className="col-12 mt-3">
                <label className="font-semi code-red">Requirements</label>
                <div>
                  <Tinymce content={newUniversity.requirements} handleEditorChange={(content) => setNewUniversity({...newUniversity,requirements:content})}/>
                </div>
              </div>
              <div className='mt-4'>
                <button className='add_blog_btn' onClick={newUniversity._id?()=>onSubmitEditUni():()=>onSubmitBlog()}>Submit</button>
              </div>
            </div>
            
          </div>
        </ModalBody>
      </Modal>
      </div>
  )
}

export default University