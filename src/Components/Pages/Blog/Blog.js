import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import './blog.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalHeader, Popover, PopoverBody, PopoverHeader, Table } from 'reactstrap'
import delete_icon from './../../../Images/icons/delete.svg'
import request, { NodeURL } from '../../../api/api'
import Pagination from 'react-js-pagination'
import { debounce, truncate } from 'lodash'
import moment from 'moment'
import Tinymce from '../../Tinymce/Tinymce'
import toast from 'react-hot-toast'

function Blog() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const admin = useSelector((state) => state?.admin?.admin);
    const [pages, setpages] = useState("");
    const [activePage, setactivePage] = useState(1);
    const [currPage, setcurrPage] = useState(25);
    const [pageRangeDisplayed, setpageRangeDisplayed] = useState(4);
    const [list, setList] = useState([]);
    const[deleteId,setDeleteId]= useState('')
    const [isBlog,setIsBlog]= useState(false)
    const [isBlogDetails,setIsBlogDetails]= useState(false)
    const [blogDetails,setBlogDetails]= useState({})
    const toggleBlogDetails = ()=> setIsBlogDetails(!isBlogDetails)
    const [newBlog,setNewBlog]=useState({
        title:'',
        description:"",
        details:"",
        image:''
    })
    const [tableOption, setTableOption] = useState({
      search: "",
      skip: 0,
      limit: 10,
      fromDate: "",
      toDate: "",
    });

    useEffect(() => {
      if (!admin?.id || !admin?.token) {
        navigate("/");
      }
    }, [admin]);

    const getAllBlogList = () => {
      request({
        url: "/admin/blog/list",
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
      getAllBlogList();
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
        setNewBlog({
            ...newBlog,
            [name]:value
        })
      }

      const handleImageUpload=(e)=>{
        const [file] = e.target.files;

        if (!file || !file.type.startsWith("image/") || file.size > 5242880) {
          toast.error("Maximum Size 5MB or format should be png,jpg,jpge");
          return;
        }
        const url = URL.createObjectURL(file);
        setNewBlog((state) => ({ ...state, image: file ,imageUrl:url}));
      }

      const onSubmitBlog =()=>{
        const {title,details,description,image}=newBlog

        if(title===""){
            return toast.error("Title required")
        }
        if(details===""){
            return toast.error("Details required")
        }
        if(description===""){
            return toast.error("Description required")
        }
        if(image===""){
            return toast.error("image required")
        }

        const formData = new FormData()

        Object.entries(newBlog).forEach(([key, value]) => {
            formData.append(key, value);
          });
        
        request({
            url:'/admin/create/blog',
            method:'POST',
            data:formData,
        }).then((res)=>{
            if(res.status===1){
                toast.success("Blog created successfully")
                setIsBlog(!isBlog)
                setNewBlog({
                    title:"",
                    details:"",
                    description:"",
                    image:"",
                })
                getAllBlogList()
            }
            if(res.status===0){
                toast.error(res.message)
            }
        })
      }

      const onView =(data)=>{
        setBlogDetails(data)
        setIsBlogDetails(!isBlogDetails)
      }

      const editBlog=(data)=>{
        setNewBlog(data)
        setIsBlog(!isBlog)
      }

      const handleEditBlog=()=>{
        const {title,details,description,image}=newBlog
        if(title===""){
            return toast.error("Title required")
        }
        if(details===""){
            return toast.error("Details required")
        }
        if(description===""){
            return toast.error("Description required")
        }
        if(image===""){
            return toast.error("image required")
        }

        const formData = new FormData()

        Object.entries(newBlog).forEach(([key, value]) => {
            formData.append(key, value);
          });
        
        request({
            url:'/admin/blog/edit',
            method:'POST',
            data:formData,
        }).then((res)=>{
            if(res.status===1){
                toast.success("Blog Updated successfully")
                setIsBlog(!isBlog)
                setNewBlog({
                    title:"",
                    details:"",
                    description:"",
                    image:"",
                })
                getAllBlogList()
            }
            if(res.status===0){
                toast.error(res.message)
            }
        })
      }

    const onDelete=(id)=>{
        setDeleteId(id)
    }

    const deleteBlog=(e,item)=>{
        e.stopPropagation()
        request({
            url:'/admin/blog/remove',
            method:'POST',
            data:{blogId:item._id,image:item.image}
        }).then((res)=>{
            if(res.status===1){
                toast.success("Blog Deleted successfully")
                setDeleteId('')
                getAllBlogList()
            }
            if(res.status===0){
                toast.error(res.message)
            }
        })
    }
    
  return (
    <Layout>
      <div className="blog-header">
        <div className='text-end'>
          <button className="add_blog_btn" onClick={()=>setIsBlog(!isBlog)}> Add Blog</button>
        </div>
      </div>

      <div className="mybookings-table-wrap mt-4">
        <Table borderless className={`mybookings-table`}>
          <thead style={{ "--bg-color": "#f3f5ff" }}>
            <tr style={{ "--text-color": "#8d9eff" }}>
              <th>S.No</th>
              <th>ID</th>
              <th>Title</th>
              <th>Posted On</th>
              <th>Description</th>
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
                    <td>{item.blogId}</td>
                    <td>{item.title}</td>
                    <td>
                      {item.postedOn
                        ? moment(item?.postedOn).format("DD/MM/YYYY")
                        : ""}
                    </td>
                    <td>{truncate(item.description, { length: 40 })}</td>
                    <td className="action-space">
                      <span className="text-primary" onClick={()=>onView(item)}>
                        <i class="fa fa-eye" aria-hidden="true"></i>
                      </span>
                      <span className="text-warning" onClick={()=>editBlog(item)}>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                      </span>
                      <span className="action-btn" id={`delete${idx}`} onClick={()=>onDelete(item._id)}>
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                      </span>
                      <Popover
                            placement="top"
                            isOpen={deleteId === item._id}
                            target={`delete${idx}`}
                            id="delete-pop"
                          >
                            <PopoverHeader>Delete Confirmation</PopoverHeader>
                            <PopoverBody>
                              <h6 className="pb-2 text-muted" style={{ lineHeight: '1.4' }}>
                                Are you sure you want to permanently delete{' '}
                                <b className="text-dark">{item.title}</b>?
                              </h6>
                              <div className="d-flex align-items-center">
                                <button type="button" className='confirm_btn' title="Yes" onClick={(e) => deleteBlog(e,item)}>
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
          activeLinkClass="blog"
        />
      </div>
      <Modal isOpen={isBlog} toggle={()=>setIsBlog(!isBlog)} centered size='lg'>
        <ModalHeader>{newBlog._id?'Edit':'Add'} Blog</ModalHeader>
        <ModalBody>
          <div className="container-fluid">
            <div className="row">
              <div className="col-6">
                <label className="font-semi code-red">Title</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="title"
                    value={newBlog.title}
                      onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Description</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="description"
                    value={newBlog.description}
                      onChange={(e) => handleChange(e)}
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
                      onChange={(e) => handleImageUpload(e)}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <label className="font-semi code-red">Details</label>
                <div>
                  <Tinymce content={newBlog.details} handleEditorChange={(content) => setNewBlog({...newBlog,details:content})}/>
                </div>
              </div>
              <div className="col-12 mt-3">
                {
                    newBlog.imageUrl?<img src={`${newBlog.imageUrl}`} alt="blog image" className='img-fluid'/>:newBlog.image!=="" && <img src={`${NodeURL}/${newBlog.image}`} alt="blog image" className='img-fluid'/>
                }
              </div>
              <div className='mt-4'>
                <button className='add_blog_btn' onClick={newBlog._id?()=>handleEditBlog():()=>onSubmitBlog()}>Submit</button>
              </div>
            </div>
            
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={isBlogDetails} toggle={toggleBlogDetails} centered size='lg'>
        <ModalHeader toggle={toggleBlogDetails}>Blog Details</ModalHeader>
        <ModalBody>
              <div className='container-fluid'>
                <div className='row'>
                    <div className='col-12'>
                        <div>
                          <img src={`${NodeURL}/${blogDetails?.image}`} className='img-fluid'/>
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-12 col-lg-6'>
                        <h5>Title</h5>
                        <p>{blogDetails?.title}</p>
                    </div>
                    <div className='col-sm-12 col-md-12 col-lg-6'>
                        <h5>Posted On</h5>
                        <p>
                        {blogDetails?.postedOn
                        ? moment(blogDetails?.postedOn).format("DD/MM/YYYY")
                        : ""}
                        </p>
                    </div>
                    <div className='col-sm-12 col-md-12 col-lg-12'>
                        <h5>Description</h5>
                        <p>
                          {
                            blogDetails?.description
                          }
                        </p>
                    </div>
                    <div className='col-sm-12 col-md-12 col-lg-12'>
                        <h5>Content</h5>
                        <p dangerouslySetInnerHTML={{__html:blogDetails?.details}}>
                          
                        </p>
                    </div>
                </div>
              </div>
        </ModalBody>
      </Modal>
    </Layout>
  );
}

export default Blog