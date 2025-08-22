import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader, Popover, PopoverBody, PopoverHeader, Table } from 'reactstrap'
import request from '../../../api/api';
import { debounce, truncate } from 'lodash';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import toast from 'react-hot-toast';

function PopularCourse() {
    const [pages, setpages] = useState("");
        const [activePage, setactivePage] = useState(1);
        const [currPage, setcurrPage] = useState(25);
        const [pageRangeDisplayed, setpageRangeDisplayed] = useState(4);
        const [list, setList] = useState([]);
        const [isCoursePlus,setIsCoursePlus]= useState(false)
        const[deleteId,setDeleteId]= useState('')
        const [newPopularCourse,setNewPopularCourse]=useState({
            name:'',
            image:''
        })
        const [tableOption, setTableOption] = useState({
            search: "",
            skip: 0,
            limit: 25,
            fromDate: "",
            toDate: "",
          });
        
          const getAllPopularCourse = () => {
            request({
              url: "/admin/get/all/subject",
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
            getAllPopularCourse();
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
            setNewPopularCourse({
                ...newPopularCourse,
                [name]:value
            })
          }

          
                const onSubmitBlog =()=>{
                  const {name,image}=newPopularCourse
          
                  if(name===""){
                      return toast.error("Name required")
                  }

                   if(image===""){
                      return toast.error("image required")
                  }

                  const formData = new FormData()

        Object.entries(newPopularCourse).forEach(([key, value]) => {
            formData.append(key, value);
          });
                 
                  request({
                      url:'/admin/add/popular/course',
                      method:'POST',
                      data:formData,
                  }).then((res)=>{
                      if(res.status===1){
                          toast.success("Popular Course created successfully")
                          setIsCoursePlus(!isCoursePlus)
                          setNewPopularCourse({
                              name:"",
                              image:''
                            })
                          getAllPopularCourse()
                      }
                      if(res.status===0){
                          toast.error(res.message)
                      }
                  })
                }
          
                const editSubject=(data)=>{
                  setNewPopularCourse(data)
                  setIsCoursePlus(!isCoursePlus)
                }
          
                const handleEditBlog=()=>{
                  const {name,_id}=newPopularCourse
          
                  if(name===""){
                      return toast.error("Name required")
                  }
                  
                  request({
                      url:'/admin/course/edit/subject',
                      method:'POST',
                      data:{name:name,subjectId:_id},
                  }).then((res)=>{
                      if(res.status===1){
                          toast.success("Subject Updated successfully")
                          setIsCoursePlus(!isCoursePlus)
                          setNewPopularCourse({
                              name:"",
                              image:""
                          })
                          getAllPopularCourse()
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
                      url:'/admin/course/remove/subject',
                      method:'POST',
                      data:{subjectId:item._id}
                  }).then((res)=>{
                      if(res.status===1){
                          toast.success("Subject Deleted successfully")
                          setDeleteId('')
                          getAllPopularCourse()
                      }
                      if(res.status===0){
                          toast.error(res.message)
                      }
                  })
              }

               const handleImageUpload=(e)=>{
                      const [file] = e.target.files;
              
                      if (!file || !file.type.startsWith("image/") || file.size > 5242880) {
                        toast.error("Maximum Size 5MB or format should be png,jpg,jpge");
                        return;
                      }
                      const url = URL.createObjectURL(file);
                      setNewPopularCourse((state) => ({ ...state, image: file ,imageUrl:url}));
                    }

  return (
     <div className="mybookings-table-wrap mt-4">
        <div className='text-end mb-3'>
          <button className="add_blog_btn"  onClick={()=>setIsCoursePlus(!isCoursePlus)}> Add </button>
        </div>
        <Table borderless className={`mybookings-table`}>
          <thead style={{ "--bg-color": "#f3f5ff" }}>
            <tr style={{ "--text-color": "#8d9eff" }}>
              <th>S.No</th>
              <th>Course Name</th>
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
                    <td className="action-space">
                      {/* <span className="text-primary" >
                        <i class="fa fa-eye" aria-hidden="true"></i>
                      </span> */}
                      <span className="text-warning" onClick={()=>editSubject(item)}>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                      </span>
                      <span className="action-btn" id={`delete-${idx}`} onClick={()=>onDelete(item._id)}>
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                      </span>
                      <Popover
                            placement="top"
                            isOpen={deleteId === item._id}
                            target={`delete-${idx}`}
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
          <Modal isOpen={isCoursePlus} toggle={()=>setIsCoursePlus(!isCoursePlus)} centered size='lg'>
        <ModalHeader>{newPopularCourse?._id?'Edit':'Add'} Popular Course</ModalHeader>
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
                    value={newPopularCourse.name}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6 mt-3">
                    <img src={newPopularCourse?.imageUrl} width={'58px'} height={'58px'}/>
              </div>
              <div className="col-12 mt-3">
                <label className="font-semi code-red">Upload Image</label>x``
                <div>
                  <input
                    type="file"
                    className="login-input"
                    name="image"
                      onChange={(e) => handleImageUpload(e)}
                  />
                </div>
              </div>
              <div className='mt-4'>
                <button className='add_blog_btn' onClick={newPopularCourse._id?()=>handleEditBlog():()=>onSubmitBlog()}>Submit</button>
              </div>
            </div>
            
          </div>
        </ModalBody>
      </Modal>
      </div>
  )
}

export default PopularCourse