import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import Pagination from 'react-js-pagination';
import { Modal, ModalHeader, Table } from 'reactstrap';
import request from '../../../api/api';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import editImg from '../../../Images/icons/edit.svg'
import deleteImg from '../../../Images/icons/delete_cross.svg'

function Students() {
  const navigate =useNavigate()
    const [pages, setpages] = useState("");
    const [activePage, setactivePage] = useState(1);
    const [currPage, setcurrPage] = useState(25);
    const [pageRangeDisplayed, setpageRangeDisplayed] = useState(4);
    const [userList, setUserList] = useState([])
    const [tableOption, setTableOption] = useState({
        search: "",
        skip: 0,
        limit: 25,
        fromDate: "",
        toDate: "",
    });


    const getAllUserList = () => {
        request({
            url: "/get/all/user/list",
            method: "POST",
            data: tableOption,
        }).then((res) => {
            if (res.status === 1) {
                setUserList(res.response.result);
                setpages(res.response.fullcount);
                setcurrPage(res.response.length);
            } else if (res && +res.status === 0) {
                setUserList(res.response.result);
                setpages(res.response.fullcount);
                setcurrPage(res.response.length);
            }
        });
    };

    useEffect(() => {
        getAllUserList();
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

        const addStudent = () =>{
          navigate('/new/student')
        }

  return (
    <Layout>
         <div className="mybookings-table-wrap mt-4">
        <div className='text-end mb-3'>
          <button className="add_blog_btn" onClick={()=>addStudent()}> Add Students</button>
        </div>
        <Table borderless className={`mybookings-table`}>
          <thead style={{ "--bg-color": "#f3f5ff" }}>
            <tr style={{ "--text-color": "#8d9eff" }}>
              <th>S.No</th>
              <th>StudentId</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Nationality</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {userList.length <= 0 ? (
              <tr className="text-center">
                <td colSpan={12}>
                  <h6>No records available</h6>
                </td>
              </tr>
            ) : (
              userList?.map((item, idx) => {
                return (
                  <tr className="cursor-pointer">
                    <td >
                      {tableOption.skip + idx + 1}
                    </td>
                    <td>{item?.studentId}</td>
                    <td>{item?.email}</td>
                    <td>{item?.firstName} {item?.lastName}</td>
                    <td>{item?.country}</td>
                    <td>{item?.city}</td>
                    <td className="action-space">
                      
                      <span className="text-warning" onClick={()=>navigate('/new/student',{state:{studentId:item._id}})}>
                        <img src={editImg} className='edit-icon'/>
                      </span>
                      <span className="action-btn" >
                        <img src={deleteImg} className='delete-icon'/>
                      </span>
                      {/* <Popover
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
                          </Popover> */}
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


         
      </div>

    </Layout>
  )
}

export default Students