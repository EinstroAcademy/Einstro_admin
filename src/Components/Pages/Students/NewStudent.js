import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import "./newStudent.css";
import axios from "axios";
import { countryList } from "./options";
import Select from "react-select";
import { customStyles } from "../Course/Course";
import { format } from "date-fns";

import rightArrow from "../../../Images/icons/right-arrow.svg";
import whiteRightArrow from "../../../Images/icons/white-right-arrow.svg";
import addPlus from "../../../Images/icons/add-plus.svg";
import request from "../../../api/api";
import toast from "react-hot-toast";

export const countryOptions = [
    { label: "India", value: "India" },
    { label: "UK", value: "UK" },
    { label: "USA", value: "USA" },
    { label: "Canada", value: "Canada" },
    { label: "Germany", value: "Germany" },
    { label: "Ireland", value: "Ireland" },
    { label: "Australia", value: "Australia" },
    { label: "France", value: "France" },

]

export const qualificationOption = [
    { label: "Undergraduate", value: "Undergraduate" },
    { label: "Postgraduate", value: "Postgraduate" },
    { label: "Diploma", value: "Diploma" },
    { label: "Doctorate", value: "Doctorate" },
]

export const englishTestOption = [
    { label: "TOEFL", value: "TOEFL" },
    { label: "IELTS", value: "IELTS" },
    { label: "PTE Academic", value: "PTE Academic" },
]

export const boardOfEducationOption = [
    { label: "CBSE", value: "CBSE" },
    { label: "State Board", value: "State Board" },
    { label: "ISC", value: "ISC" },
]

export const schoolMediumOption = [
    { label: "Tamil", value: "Tamil" },
    { label: "English", value: "English" },
    { label: "Hindi", value: "Hindi" },
]


const gradeOption = [
    {
        label: "CGPA 4", value: 'CGPA 4'
    },
    {
        label: "CGPA 5", value: 'CGPA 5'
    },
    {
        label: "CGPA 7", value: 'CGPA 7'
    },
    {
        label: "CGPA 10", value: 'CGPA 10'
    },
    {
        label: 'Percentage(1-100)', value: 'Percentage(1-100)'
    }
]

function NewStudent() {
  const [countryOption, setCountryOption] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [isQualification, setIsQualification] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    firstLanguage: "",
    country: "",
    maritalStatus: "",
    gender: "",
    email: "",
    passport: "",
    passport_expiry_date: "",
    address: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    setCountryOption(
      countryList.map((country) => {
        return { label: country.name, value: country.name };
      })
    );
  }, []);

  const handleChanges = (name, value) => {
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleSaveNewStudent = () => {
    const requiredFields = [
      "firstName",
      "dob",
      "firstLanguage",
      "country",
      "maritalStatus",
      "gender",
      "email",
      "passport",
      "passport_expiry_date",
      "address",
      "city",
      "state",
      "postalCode",
    ];

    // Check for missing or empty fields
    for (let field of requiredFields) {
      if (!newStudent[field] || newStudent[field].trim() === "") {
        toast.error(`Please fill in the ${field.replace(/_/g, " ")}`);
        return;
      }
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // DOB validation: at least 17 years old
    const dob = new Date(newStudent.dob);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    if (
      age < 17 ||
      (age === 17 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
    ) {
      toast.error("Student must be at least 17 years old.");
      return;
    }

    // Passport expiry date must be in the future
    const expiry = new Date(newStudent.passport_expiry_date);
    if (expiry <= today) {
      toast.error("Passport expiry date must be in the future.");
      return;
    }

    // Submit data if validation passes
    request({
      url: "/admin/create/new/user",
      method: "POST",
      data: newStudent,
    })
      .then((res) => {
        if (res.data.status === 1) {
          setActiveTab(2);
          toast.success("General Information Saved Successfully");
        } else if (res.data.status === 0) {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while saving data.");
      });
  };

  return (
    <Layout>
      <div className="container-fluid new-std-container">
        <h4 className="new-std-head">New Student Details</h4>
        <hr />
        <div className="mb-5">
          <Nav id="courseTabs" tabs>
            <NavItem>
              <NavLink
                className={`${activeTab === 1 ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(1);
                }}
              >
                General Information
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`${activeTab === 2 ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(2);
                }}
              >
                Academic Qualification
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`${activeTab === 3 ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(3);
                }}
              >
                School
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`${activeTab === 4 ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(4);
                }}
              >
                Exams
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`${activeTab === 5 ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(5);
                }}
              >
                Certificates
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={1}>
            <div className="std-info">
              <h6 className="new-std-info">Information</h6>
              <Row className="mb-2">
                <Col lg="4">
                  <label>
                    First Name <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      value={newStudent?.firstName}
                      onChange={(e) =>
                        handleChanges("firstName", e.target.value)
                      }
                    />
                  </div>
                  <span className="std-req">
                    {" "}
                    As per your passport or ID proof
                  </span>
                </Col>
                <Col lg="4">
                  <label>Middle Name</label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      onChange={(e) =>
                        handleChanges("middleName", e.target.value)
                      }
                    />
                  </div>
                </Col>
                <Col lg="4">
                  <label>Last Name </label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      onChange={(e) =>
                        handleChanges("lastName", e.target.value)
                      }
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg="4">
                  <label>
                    Email<span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="email"
                      className="std-input-control"
                      onChange={(e) => handleChanges("email", e.target.value)}
                    />
                  </div>
                </Col>
                <Col lg="4">
                  <label>
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="date"
                      className="std-input-control"
                      value={
                        newStudent?.dob
                          ? format(new Date(newStudent.dob), "yyyy-MM-dd")
                          : ""
                      }
                      onChange={(e) => handleChanges("dob", e.target.value)}
                    />
                  </div>
                </Col>
                <Col lg="4">
                  <label>
                    First Language <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      onChange={(e) =>
                        handleChanges("firstLanguage", e.target.value)
                      }
                    />
                  </div>
                </Col>
                <Col lg="4">
                  <label>
                    Country of Citienship <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      onChange={(e) => handleChanges("country", e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg="4">
                  <label>
                    Marital Status<span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="Single"
                      className="me-1"
                      onChange={(e) =>
                        handleChanges("maritalStatus", e.target.value)
                      }
                    />
                    <label className="me-3">Single</label>

                    <input
                      type="radio"
                      name="maritalStatus"
                      value="Married"
                      className="me-1"
                      onChange={(e) =>
                        handleChanges("maritalStatus", e.target.value)
                      }
                    />
                    <label className="me-3">Married</label>
                  </div>
                </Col>

                <Col lg="4">
                  <label>
                    Gender<span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      className="me-1"
                      onChange={(e) => handleChanges("gender", e.target.value)}
                    />
                    <label className="me-3">Male</label>

                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      className="me-1"
                      onChange={(e) => handleChanges("gender", e.target.value)}
                    />
                    <label className="me-3">Female</label>
                  </div>
                </Col>
              </Row>

              <hr />
              <h6 className="new-std-info">Passport info</h6>
              <Row className="mb-2">
                <Col lg="4">
                  <label>
                    Passport Number <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      onChange={(e) =>
                        handleChanges("passport", e.target.value)
                      }
                    />
                  </div>
                </Col>
                <Col lg="4">
                  <label>
                    Passport Expiry Date <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="date"
                      className="std-input-control"
                      onChange={(e) =>
                        handleChanges("passport_expiry_date", e.target.value)
                      }
                    />
                  </div>
                </Col>
              </Row>
              <hr />
              <h6 className="new-std-info">Address Details</h6>
              <Row className="mb-2">
                <Col lg="8">
                  <label>
                    Address <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      onChange={(e) => handleChanges("address", e.target.value)}
                    />
                  </div>
                </Col>
                <Col lg="4">
                  <label>
                    City/Town <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      onChange={(e) => handleChanges("city", e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg="4">
                  <label>
                    Country <span className="text-danger">*</span>
                  </label>
                  <div>
                    <Select
                      styles={customStyles}
                      options={countryOption}
                      isClearable
                      onChange={(e) => handleChanges("country", e.value)}
                    />
                  </div>
                </Col>
                <Col lg="4">
                  <label>
                    State <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      onChange={(e) => handleChanges("state", e.target.value)}
                    />
                  </div>
                </Col>
                <Col lg="4">
                  <label>
                    Postal/Zip code <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      onChange={(e) =>
                        handleChanges("postalCode", e.target.value)
                      }
                    />
                  </div>
                </Col>
              </Row>
              <div className="text-end mt-5">
                <button className="cancel-btn">Cancel</button>
                <button
                  className="next-btn"
                  onClick={() => handleSaveNewStudent()}
                >
                  Next <img src={whiteRightArrow} />
                </button>
              </div>
            </div>
          </TabPane>
          <TabPane tabId={2}>
            <div className="container-fluid">
              <div>
                <button className="qlf-new-btn" onClick={() => setIsQualification(!isQualification)}>
                  <img src={addPlus} />
                  Add New
                </button>
              </div>
              <Modal
                isOpen={isQualification}
                toggle={() => setIsQualification(!isQualification)}
                centered
                size="lg"
              >
                <ModalHeader
                  toggle={() => setIsQualification(!isQualification)}
                >
                  Add Qualification
                </ModalHeader>
                <ModalBody>
                  <div className='container'>
                    <div className='my-3'>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="fullName">Academic Qualification</Label>
                            <Select 
                            styles={customStyles} 
                            options={qualificationOption}
                            // value={qualificationOption?.filter((op) => op.value === qualification.degree)} 
                            // onChange={(e) => handleQualificationChange('degree', e.value)} 
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="country">Country</Label>
                            <Select 
                            styles={customStyles}
                            options={countryOptions}
                            // value={countryOptions?.filter((e) => e.value === userProfile.country)} 
                            // onChange={(e) => handleQualificationChange('country', e.value)} 
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr/>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="University1">University/College</Label>
                            <Input id="University1" type="text" 
                            // value={qualification.university} 
                            // placeholder="University" 
                            // onChange={(e) => handleQualificationChange('university', e.target.value)} 
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="University1">Language of Instruction</Label>
                            <Select 
                            styles={customStyles}
                            options={schoolMediumOption}
                            // value={gradeOption.filter((op) => op.value === qualification.cgpa_level)} 
                            // onChange={(e) => handleQualificationChange('cgpa_level', e.value)} 
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="GradeScheme">Grade Scheme</Label>
                            <Select 
                            styles={customStyles}
                            options={gradeOption}
                            // value={gradeOption.filter((op) => op.value === qualification.cgpa_level)} 
                            // onChange={(e) => handleQualificationChange('cgpa_level', e.value)} 
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Score</Label>
                            <Input type="text" 
                            // value={qualification.score} 
                            // placeholder="Score(1-100)" 
                            // onChange={(e) => handleQualificationChange('score', e.target.value)} 
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr/>
                      <Row>
                        <Col md={12}>
                          <FormGroup>
                            <Label >Address</Label>
                            <Input type="text" 
                            // value={qualification.score} 
                            // placeholder="Score(1-100)" 
                            // onChange={(e) => handleQualificationChange('score', e.target.value)} 
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="d-flex gap-3 mt-4">
                        <Button className='discard-btn' 
                        // onClick={() => setIsQualification(false)}
                        >Discard</Button>
                        <Button className='save-btn' 
                        // onClick={() => updateUserQualification()}
                        >Save</Button>
                      </div>
                    </div>



                  </div>
                </ModalBody>
              </Modal>
            </div>
          </TabPane>
        </TabContent>
      </div>
    </Layout>
  );
}

export default NewStudent;
