import React from 'react'
import { Pagination, Table } from 'reactstrap'

function SubjectBranch() {
  return (
    <div className="mybookings-table-wrap mt-4">
    <div className='text-end mb-3'>
      <button className="add_blog_btn"> Add Branch</button>
    </div>
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
        {/* {list.length <= 0 ? (
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
        )} */}
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
    //   activePage={activePage}
    //   itemsCountPerPage={currPage}
    //   totalItemsCount={pages}
    //   pageRangeDisplayed={pageRangeDisplayed}
    //   onChange={paginate}
      itemClass="page-item"
      linkClass="page-link"
      activeLinkClass="blog"
    />
  </div>
  )
}

export default SubjectBranch