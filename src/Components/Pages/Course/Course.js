import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Popover,
  PopoverBody,
  PopoverHeader,
  TabContent,
  TabPane,
  Table,
} from "reactstrap";
import Subject from "./Subject";
import SubjectBranch from "./SubjectBranch";
import "./course.css";
import Branch from "./Branch";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import request from "../../../api/api";
import moment from "moment";
import { debounce, truncate } from "lodash";
import Pagination from "react-js-pagination";
import Tinymce from "../../Tinymce/Tinymce";
import Select from "react-select";
import toast from "react-hot-toast";
import University from "./University";

// export const customStyles = {
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isFocused ? "#8f1409" : "white", // Change hover color
//     color: state.isFocused ? "white" : "#8f1409", // Change text color on hover
//     fontFamily: "Metropolis-Medium",
//     height:'40px'
//   }),
//   control: (provided, state) => ({
//     ...provided,
//     borderColor: "#8f1409",
//     height:'40px'
//   }),
//   menu: (provided) => ({
//     ...provided,
//     zIndex: 9999,
//     height:'40px'
//   }),
// };
export const customStyles = {
  container: (styles) => ({
    ...styles,
    width: "100%",
    marginRight: "20px",
    fontSize: "16px",
    color: "#101828",
  }),
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
    minHeight: "40px", // Set desired height
    height: "40px",     // Fix height
    borderRadius: "8px",
    borderColor: isFocused ? "#8f1409" : "#D0D5DD",
    boxShadow: "none",
    ":hover": {
      borderColor: "#8f1409",
    },
  }),
  valueContainer: (styles) => ({
    ...styles,
    padding: "2px 8px", // Reduce internal padding
    height: "40px",     // Align with control height
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "white",
    border: "1px solid #D0D5DD",
    zIndex: 9999,
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    cursor: "pointer",
    backgroundColor: isFocused ? "#D0D5DD" : "white",
    color: "#101828",
    ":hover": {
      backgroundColor: "grey",
    },
    fontSize: "14px",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#667085",
    fontSize: "14px",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#101828",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "#98A2B3",
    padding: "4px", // make icon more compact
    ":hover": {
      color: "#98A2B3",
    },
  }),
};


export const countryOptions = [
  { label: "UK", value: "UK" },
  { label: "USA", value: "USA" },
  { label: "Canada", value: "Canada" },
  { label: "Germany", value: "Germany" },
  { label: "Ireland", value: "Ireland" },
  { label: "Australia", value: "Australia" },
  { label: "France", value: "France" },
];

export const studyLevels = [
  {
    label: "Doctorate",
    value: "Doctorate",
  },
  {
    label: "Postgraduate",
    value: "Postgraduate",
  },
  {
    label: "Undergraduate",
    value: "Undergraduate",
  },
];

function Course() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1");
  const admin = useSelector((state) => state?.admin?.admin);
  const [pages, setpages] = useState("");
  const [activePage, setactivePage] = useState(1);
  const [currPage, setcurrPage] = useState(25);
  const [pageRangeDisplayed, setpageRangeDisplayed] = useState(4);
  const [list, setList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [university, setUniversity] = useState([]);
  const [branch, setBranch] = useState([]);
  const [isCourse, setIsCourse] = useState(false);
  const[deleteId,setDeleteId]= useState('')
  const [tableOption, setTableOption] = useState({
    search: "",
    skip: 0,
    limit: 10,
    fromDate: "",
    toDate: "",
  });
  const [newCourse, setNewCourse] = useState({
    title: "",
    universityId: "",
    location: "",
    rank: "",
    fees: "",
    duration: "",
    score: "",
    description: "",
    subjectId: "",
    branchId: "",
    country: "",
    qualification: "",
  });

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    if (!admin?.id || !admin?.token) {
      navigate("/");
    }
  }, [admin]);

  const getAllCourseList = () => {
    request({
      url: "/admin/get/all/course",
      method: "POST",
      data: tableOption,
    }).then((res) => {
      if (res.status === 1) {
        setList(res.response.result);
        setpages(res.response.fullcount);
        setcurrPage(res.response.length);
      } else if (res && +res.status === 0) {
        setList(res.response.result);
        setpages(res.response.fullcount);
        setcurrPage(res.response.length);
      }
    });
  };

  const getAllSubjects = () => {
    request({
      url: "/admin/course/get/subject",
      method: "POST",
    }).then((res) => {
      if (res.status === 1) {
        setSubjects(
          res.response.map((list) => {
            return {
              label: list.name,
              value: list._id,
            };
          })
        );
      } else if (res && +res.status === 0) {
        setSubjects([]);
        console.log(res);
      }
    });
  };

  const getAllUniversities = () => {
    request({
      url: "/admin/all/university/list",
      method: "POST",
    }).then((res) => {
      if (res.status === 1) {
        setUniversity(
          res?.response?.map((list) => {
            return {
              label: list.name,
              value: list,
            };
          })
        );
      } else if (res && +res.status === 0) {
        setUniversity([]);
        console.log(res);
      }
    });
  };

  const getAllBranch = () => {
    request({
      url: "/admin/course/get/branch",
      method: "POST",
    }).then((res) => {
      if (res.status === 1) {
        setBranch(
          res.response.map((list) => {
            return {
              label: list.name,
              value: list._id,
            };
          })
        );
      } else if (res && +res.status === 0) {
        setBranch([]);
        console.log(res);
      }
    });
  };

  useEffect(() => {
    getAllCourseList();
  }, [tableOption,activeTab]);
  useEffect(() => {
    getAllSubjects();
    getAllBranch();
    getAllUniversities()
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: value,
    });
  };

  const onSubmitCourse = () => {
    const {
      title,
      university,
      location,
      rank,
      fees,
      duration,
      score,
      description,
      subjectId,
      branchId,
      country,
      qualification,
    } = newCourse;

    if (title === "") {
      return toast.error("Title required");
    }
    if (university === "") {
      return toast.error("University required");
    }
    if (location === "") {
      return toast.error("Location required");
    }
    if (rank === "") {
      return toast.error("Rank required");
    }
    if (fees === "") {
      return toast.error("fees required");
    }
    if (duration === "") {
      return toast.error("Duration required");
    }
    if (score === "") {
      return toast.error("Score required");
    }
    if (description === "") {
      return toast.error("Description required");
    }
    if (subjectId === "") {
      return toast.error("Subject required");
    }
    if (branchId === "") {
      return toast.error("Branch required");
    }
    if (country === "") {
      return toast.error("Country required");
    }
    if (qualification === "") {
      return toast.error("Qualification required");
    }

    request({
      url: "/admin/create/course",
      method: "POST",
      data: newCourse,
    }).then((res) => {
      if (res.status === 1) {
        toast.success("Course created successfully");
        setIsCourse(!isCourse);
        setNewCourse({
          title: "",
          university: "",
          location: "",
          rank: "",
          fees: "",
          duration: "",
          score: "",
          description: "",
          subjectId: "",
          branchId: "",
          country: "",
          qualification: "",
        });
        getAllCourseList();
      }
      if (res.status === 0) {
        toast.error(res.message);
      }
    });
  };

  const editCourse=(data)=>{
    setNewCourse(data)
    setIsCourse(!isCourse)
  }

  const handleEditBlog = () => {
    const {
      title,
      university,
      location,
      rank,
      fees,
      duration,
      score,
      description,
      subjectId,
      branchId,
      country,
      qualification,
    } = newCourse;

    if (title === "") {
      return toast.error("Title required");
    }
    if (university === "") {
      return toast.error("University required");
    }
    if (location === "") {
      return toast.error("Location required");
    }
    if (rank === "") {
      return toast.error("Rank required");
    }
    if (fees === "") {
      return toast.error("fees required");
    }
    if (duration === "") {
      return toast.error("Duration required");
    }
    if (score === "") {
      return toast.error("Score required");
    }
    if (description === "") {
      return toast.error("Description required");
    }
    if (subjectId === "") {
      return toast.error("Subject required");
    }
    if (branchId === "") {
      return toast.error("Branch required");
    }
    if (country === "") {
      return toast.error("Country required");
    }
    if (qualification === "") {
      return toast.error("Qualification required");
    }

    request({
      url: "/admin/course/update",
      method: "POST",
      data: newCourse,
    }).then((res) => {
      if (res.status === 1) {
        toast.success("Course Updated successfully");
        setIsCourse(!isCourse);
        setNewCourse({
          title: "",
          university: "",
          location: "",
          rank: "",
          fees: "",
          duration: "",
          score: "",
          description: "",
          subjectId: "",
          branchId: "",
          country: "",
          qualification: "",
        });
        getAllCourseList();
      }
      if (res.status === 0) {
        toast.error(res.message);
      }
    });
  };

  const onDelete=(id)=>{
    setDeleteId(id)
}

const deleteCourse=(e,item)=>{
    e.stopPropagation()
    request({
        url:'/admin/course/remove',
        method:'POST',
        data:{courseId:item._id}
    }).then((res)=>{
        if(res.status===1){
            toast.success("Course Deleted successfully")
            setDeleteId('')
            getAllCourseList()
        }
        if(res.status===0){
            toast.error(res.message)
        }
    })
}

  return (
    <Layout>
      <div className="course-header">
        <div>
          <Nav id="courseTabs" tabs>
            <NavItem>
              <NavLink
                className={`${activeTab === "1" ? "active" : ""}`}
                onClick={() => {
                  toggle("1");
                }}
              >
                Course List
              </NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink
                className={`${activeTab === "2" ? "active" : ""}`}
                onClick={() => {
                  toggle("2");
                }}
              >
                Subject Branch
              </NavLink>
            </NavItem> */}
            <NavItem>
              <NavLink
                className={`${activeTab === "3" ? "active" : ""}`}
                onClick={() => {
                  toggle("3");
                }}
              >
                Branch
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`${activeTab === "4" ? "active" : ""}`}
                onClick={() => {
                  toggle("4");
                }}
              >
                Subject
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`${activeTab === "5" ? "active" : ""}`}
                onClick={() => {
                  toggle("5");
                }}
              >
                University
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </div>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <div className="mybookings-table-wrap mt-4">
            <div>
              <input
                className=""
                type="text"
                onChange={(e) => search(e.target.value)}
              />
            </div>
            <div className="text-end mb-3">
              <button
                className="add_blog_btn"
                onClick={() => setIsCourse(!isCourse)}
              >
                {" "}
                Add Course
              </button>
            </div>
            <Table borderless className={`mybookings-table`}>
              <thead style={{ "--bg-color": "#f3f5ff" }}>
                <tr style={{ "--text-color": "#8d9eff" }}>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>University</th>
                  <th>Location</th>
                  <th>Degree</th>
                  <th>Score</th>
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
                        <td>{tableOption.skip + idx + 1}</td>
                        <td>{item.title}</td>
                        <td>{item?.universityDetails?.name}</td>
                        <td>{item.location}</td>
                        <td>{item.qualification}</td>
                        <td>{item.score}</td>
                        <td className="action-space">
                          <span className="text-primary">
                            <i class="fa fa-eye" aria-hidden="true"></i>
                          </span>
                          <span className="text-warning" onClick={()=>editCourse(item)}>
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
                                <button type="button" className='confirm_btn' title="Yes" onClick={(e) => deleteCourse(e,item)}>
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
              nextPageText={
                <i class="fa fa-angle-right" aria-hidden="true"></i>
              }
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
        </TabPane>
        {/* <TabPane tabId="2">
          <SubjectBranch />
        </TabPane> */}
        <TabPane tabId="3">
          <Branch />
        </TabPane>
        <TabPane tabId="4">
          <Subject />
        </TabPane>
        <TabPane tabId="5">
          <University />
        </TabPane>
      </TabContent>
      <Modal
        isOpen={isCourse}
        toggle={() => setIsCourse(!isCourse)}
        centered
        size="lg"
      >
        <ModalHeader>{newCourse._id ? "Edit" : "Add"} Course</ModalHeader>
        <ModalBody>
          <div className="container-fluid">
            <div className="row">
              <div className="col-6">
                <label className="font-semi code-red">Title</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="eg: MSc Financial Management"
                    name="title"
                    value={newCourse.title}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">University</label>
                <div>
                  <Select
                    options={university}
                    styles={customStyles}
                    value={university.filter((op)=>{
                        return op.value._id === newCourse.universityId
                    })}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, universityId: e.value._id ,country:e.value?.country,location:e.value?.location,currency:e?.value?.currency?.symbol})
                    }
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Qualification</label>
                <div>
                  <Select
                    options={studyLevels}
                    styles={customStyles}
                    value={studyLevels.filter((op)=>{
                        return op.value === newCourse.qualification
                    })}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, qualification: e.value })
                    }
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Duration</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="duration"
                    value={newCourse.duration}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Subject</label>
                <div>
                  <Select
                    options={subjects}
                    styles={customStyles}
                    value={subjects.filter((op)=>{
                        return op.value === newCourse.subjectId
                    })}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, subjectId: e.value })
                    }
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Branch</label>
                <div>
                  <Select
                    options={branch}
                    styles={customStyles}
                    value={branch.filter((op)=>{
                        return op.value === newCourse.branchId
                    })}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, branchId: e.value })
                    }
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Rank</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="rank"
                    value={newCourse.rank}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Score</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="score"
                    value={newCourse.score}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Fees</label>
                <div>
                  <input
                    type="text"
                    className="login-input"
                    name="fees"
                    placeholder={`${newCourse?.currency}`}
                    value={newCourse.fees}
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
                    value={newCourse.location}
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
                    value={countryOptions.filter((op)=>{
                        return op.value === newCourse.country
                    })}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, country: e.value })
                    }
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <label className="font-semi code-red">Description</label>
                <div>
                  <Tinymce
                    content={newCourse.description}
                    handleEditorChange={(content) =>
                      setNewCourse({ ...newCourse, description: content })
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="add_blog_btn"
                  onClick={
                    newCourse._id
                      ? () => handleEditBlog()
                      : () => onSubmitCourse()
                  }
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </Layout>
  );
}

export default Course;
