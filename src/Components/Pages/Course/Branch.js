import React, { useEffect, useState } from 'react'
import request from '../../../api/api';
import { debounce } from 'lodash';
import Pagination from 'react-js-pagination';
import { Modal, ModalBody, ModalHeader, Popover, PopoverBody, PopoverHeader, Table } from 'reactstrap';
import toast from 'react-hot-toast';

function Branch() {
    const [pages, setpages] = useState("");
    const [activePage, setactivePage] = useState(1);
    const [currPage, setcurrPage] = useState(25);
    const [pageRangeDisplayed, setpageRangeDisplayed] = useState(4);
    const [list, setList] = useState([]);
    const [isBranch,setIsBranch]= useState(false)
    const[deleteId,setDeleteId]= useState('')
    const [newBranch,setNewBranch]=useState({
        name:'',
    })
    const [tableOption, setTableOption] = useState({
        search: "",
        skip: 0,
        limit: 25,
        fromDate: "",
        toDate: "",
    });
    
    const getAllBranchList = () => {
        request({
          url: "/admin/get/all/branch",
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
        getAllBranchList();
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
        setNewBranch({
            ...newBranch,
            [name]:value
        })
      }

      const onSubmitBranch =()=>{
        const {name}=newBranch

        if(name===""){
            return toast.error("Name required")
        }
       
        request({
            url:'/admin/create/branch',
            method:'POST',
            data:{name:name},
        }).then((res)=>{
            if(res.status===1){
                toast.success("Branch created successfully")
                setIsBranch(!isBranch)
                setNewBranch({
                    name:"",
                })
                getAllBranchList()
            }
            if(res.status===0){
                toast.error(res.message)
            }
        })
      }

      const editBranch=(data)=>{
        setNewBranch(data)
        setIsBranch(!isBranch)
      }

      const handleEditBranch=()=>{
        const {name,_id}=newBranch

        if(name===""){
            return toast.error("Name required")
        }
        
        request({
            url:'/admin/course/edit/branch',
            method:'POST',
            data:{name:name,branchId:_id},
        }).then((res)=>{
            if(res.status===1){
                toast.success("Branch Updated successfully")
                setIsBranch(!isBranch)
                setNewBranch({
                    name:"",
                })
                getAllBranchList()
            }
            if(res.status===0){
                toast.error(res.message)
            }
        })
      }

      const onDelete=(id)=>{
        setDeleteId(id)
    }

    const deleteBranch=(e,item)=>{
        e.stopPropagation()
        request({
            url:'/admin/course/remove/branch',
            method:'POST',
            data:{branchId:item._id}
        }).then((res)=>{
            if(res.status===1){
                toast.success("Branch Deleted successfully")
                setDeleteId('')
                getAllBranchList()
            }
            if(res.status===0){
                toast.error(res.message)
            }
        })
    }



  return (
    <div className="mybookings-table-wrap mt-4">
      <div>
        <input
          className=""
          type="text"
          onChange={(e) => search(e.target.value)}
          placeholder='Search Branch'
        />
      </div>
    <div className='text-end mb-3'>
      <button className="add_blog_btn" onClick={()=>setIsBranch(!isBranch)}> Add Branch</button>
    </div>
    <Table borderless className={`mybookings-table`}>
      <thead style={{ "--bg-color": "#f3f5ff" }}>
        <tr style={{ "--text-color": "#8d9eff" }}>
          <th>S.No</th>
          <th>Branch Name</th>
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
                  <span className="text-warning" onClick={()=>editBranch(item)}>
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
                            <button type="button" className='confirm_btn' title="Yes" onClick={(e) => deleteBranch(e,item)}>
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
    <Modal isOpen={isBranch} toggle={()=>setIsBranch(!isBranch)} centered size='lg'>
        <ModalHeader>{newBranch?._id?'Edit':'Add'} Branch</ModalHeader>
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
                    value={newBranch.name}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className='mt-4'>
                <button className='add_blog_btn' onClick={newBranch._id?()=>handleEditBranch():()=>onSubmitBranch()}>Submit</button>
              </div>
            </div>
            
          </div>
        </ModalBody>
      </Modal>
  </div>
  )
}

export default Branch