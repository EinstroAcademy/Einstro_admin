import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
  Table,
  Button,
  Progress
} from 'reactstrap';
import { User, FileText, GraduationCap, Globe, Settings, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import request, { NodeURL } from '../../../api/api';
import Layout from '../Layout/Layout';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { format } from 'date-fns';

const StudentDetails = () => {
    const userId = useLocation()?.state?.studentId
  const [activeTab, setActiveTab] = useState('1');
  const [userData, setuserData] = useState({});
  const [completion,setCompletion] = useState({
    overall:0
  })

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const getStatusBadge = (status) => {
    const statusColors = {
      approved: 'success',
      pending: 'warning',
      rejected: 'danger',
      under_review: 'info',
      not_uploaded: 'secondary'
    };
    return <Badge color={statusColors[status] || 'secondary'}>{status?.replace('_', ' ')}</Badge>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-success" size={16} />;
      case 'pending':
        return <Clock className="text-warning" size={16} />;
      case 'rejected':
        return <XCircle className="text-danger" size={16} />;
      default:
        return <Clock className="text-secondary" size={16} />;
    }
  };

 

  const getUser =()=>{
    request({
        url:'/admin/get/user',
        method:'POST',
        data:{
            userId:userId
        }
    }).then((res)=>{
            if(res.status==1){
                setuserData(res.student)
                setCompletion(res.completion)
            }
    }).catch((err)=>{
        console.log(err)
    })
  }

  useEffect(()=>{
    if(userId){
        getUser()
    }
  },[userId])

  return (
   <Layout>
     <Container fluid className="py-4">
      <Row>
        <Col md={12}>
          {/* Header Card */}
          <Card className="mb-4">
            <CardBody>
              <Row className="align-items-center">
                <Col md={2} className="text-center">
                  <img
                    src={`${NodeURL}/${userData?.image}`}
                    alt="Profile"
                    className="rounded-circle mb-2"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <div>
                  </div>
                </Col>
                <Col md={6}>
                  <h4 className="mb-1">{userData?.firstName} {userData?.lastName}</h4>
                  <p className="text-muted mb-2">{userData?.email}</p>
                  <p className="mb-1">
                    <strong>Student ID:</strong> {userData?.studentId} | 
                    <strong> Mobile:</strong> {userData?.mobile}
                  </p>
                  <p className="mb-0">
                    <strong>Location:</strong> {userData?.city}, {userData?.state}, {userData?.country}
                  </p>
                </Col>
                <Col md={4} className="text-end ">
                    <div className='d-flex justify-content-between align-items-center'>
                        <div style={{ width: 100, height: 80 }}>
                          <CircularProgressbar
                            value={completion?.overall}
                            text={`${completion?.overall}%`}
                            styles={buildStyles({
                              strokeLinecap: "round",
                              trailColor: "#dfdfdf",
                              pathColor: "#c5113e",
                              textColor: "#c5113e",
                            })}
                          />
                        </div>
                  <div>
                    <div className="mb-2">
                    <strong>Status: </strong>
                    {getStatusBadge(userData?.status)}
                  </div>
                  <div className="mb-2">
                    <strong>Verified: </strong>
                    {userData?.otpVerified ? 
                      <Badge color="success">Verified</Badge> : 
                      <Badge color="warning">Pending</Badge>
                    }
                  </div>
                  <small className="text-muted">
                    Registered: {new Date(userData?.uploadedOn).toLocaleDateString()}
                  </small>
                  </div>
                    </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Navigation Tabs */}
          <Card>
            <CardHeader>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={activeTab === '1' ? 'active' : ''}
                    onClick={() => toggle('1')}
                    style={{ cursor: 'pointer' }}
                  >
                    <User size={16} className="me-1" />
                    Personal Info
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === '2' ? 'active' : ''}
                    onClick={() => toggle('2')}
                    style={{ cursor: 'pointer' }}
                  >
                    <GraduationCap size={16} className="me-1" />
                    Education
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === '3' ? 'active' : ''}
                    onClick={() => toggle('3')}
                    style={{ cursor: 'pointer' }}
                  >
                    <FileText size={16} className="me-1" />
                    Documents
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === '4' ? 'active' : ''}
                    onClick={() => toggle('4')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Globe size={16} className="me-1" />
                    Applications
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === '5' ? 'active' : ''}
                    onClick={() => toggle('5')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Settings size={16} className="me-1" />
                    Admin Actions
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>
            <CardBody>
              <TabContent activeTab={activeTab}>
                {/* Personal Information Tab */}
                <TabPane tabId="1">
                  <Row>
                    <Col md={6}>
                      <h5>Basic Information</h5>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td><strong>First Name:</strong></td>
                            <td>{userData?.firstName}</td>
                          </tr>
                          <tr>
                            <td><strong>Last Name:</strong></td>
                            <td>{userData?.lastName}</td>
                          </tr>
                          <tr>
                            <td><strong>Date of Birth:</strong></td>
                            <td>{userData?.dob}</td>
                          </tr>
                          <tr>
                            <td><strong>Gender:</strong></td>
                            <td>{userData?.gender}</td>
                          </tr>
                          <tr>
                            <td><strong>Nationality:</strong></td>
                            <td>{userData?.nationality}</td>
                          </tr>
                          <tr>
                            <td><strong>First Language:</strong></td>
                            <td>{userData?.firstLanguage}</td>
                          </tr>
                          <tr>
                            <td><strong>Marital Status:</strong></td>
                            <td>{userData?.maritalStatus}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={6}>
                      <h5>Contact & Address</h5>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td><strong>Email:</strong></td>
                            <td>{userData?.email}</td>
                          </tr>
                          <tr>
                            <td><strong>Mobile:</strong></td>
                            <td>{userData?.mobile}</td>
                          </tr>
                          <tr>
                            <td><strong>Address:</strong></td>
                            <td>{userData?.address}</td>
                          </tr>
                          <tr>
                            <td><strong>City:</strong></td>
                            <td>{userData?.city}</td>
                          </tr>
                          <tr>
                            <td><strong>State:</strong></td>
                            <td>{userData?.state}</td>
                          </tr>
                          <tr>
                            <td><strong>Postal Code:</strong></td>
                            <td>{userData?.postalCode}</td>
                          </tr>
                          <tr>
                            <td><strong>Passport:</strong></td>
                            <td>{userData?.passport}</td>
                          </tr>
                          <tr>
                            <td><strong>Passport Expiry:</strong></td>
                            <td>{userData?.passport_expiry_date ? format(new Date(userData?.passport_expiry_date),'dd/MM/yyyy') :''}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </TabPane>
                {/* Education Tab */}
                <TabPane tabId="2">
                  <Row>
                    <Col md={12}>
                      <div className="mb-4">
                        <h5>Higher Education</h5>
                        {userData?.qualification?.map((qual, index) => (
                          <Card key={index} className="mb-3">
                            <CardBody>
                              <Row>
                                <Col md={6}>
                                  <p><strong>Degree:</strong> {qual?.degree}</p>
                                  <p><strong>University:</strong> {qual?.university}</p>
                                  <p><strong>Course:</strong> {qual?.course}</p>
                                </Col>
                                <Col md={6}>
                                  <p><strong>Country:</strong> {qual?.country}</p>
                                  <p><strong>Score:</strong> {qual?.score} ({qual?.cgpa_level})</p>
                                  <p><strong>Medium:</strong> {qual?.medium}</p>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        ))}
                      </div>

                      <div className="mb-4">
                        <h5>School Education</h5>
                        {userData?.school?.map((school, index) => (
                          <Card key={index} className="mb-3">
                            <CardBody>
                              <Row>
                                <Col md={6}>
                                  <p><strong>Grade:</strong> {school?.grade}</p>
                                  <p><strong>School:</strong> {school?.name}</p>
                                  <p><strong>Course:</strong> {school?.course}</p>
                                  <p><strong>Duration:</strong> {school?.from ? format(new Date(school?.from),'dd/MM/yyyy') :''} - {school?.to ? format(new Date(school?.to),'dd/MM/yyyy') :''}</p>
                                </Col>
                                <Col md={6}>
                                  <p><strong>Score:</strong> {school?.score} ({school?.cgpa_level})</p>
                                  <p><strong>Medium:</strong> {school?.medium}</p>
                                  <p><strong>Address:</strong> {school?.address}</p>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        ))}
                      </div>

                      <div className="mb-4">
                        <h5>English Proficiency Test</h5>
                        <Card>
                          <CardBody>
                            {
                              userData?.englishTest?.map((test)=>{
                                return <Row>
                              <Col md={6}>
                                <p><strong>Test:</strong> {test?.test}</p>
                                <p><strong>Overall Score:</strong> {test?.overallScore}</p>
                              </Col>
                              <Col md={6}>
                                <Table size="sm">
                                  <tbody>
                                    <tr>
                                      <td><strong>Listening:</strong></td>
                                      <td>{test?.listening}</td>
                                    </tr>
                                    <tr>
                                      <td><strong>Reading:</strong></td>
                                      <td>{test?.reading}</td>
                                    </tr>
                                    <tr>
                                      <td><strong>Speaking:</strong></td>
                                      <td>{test?.speaking}</td>
                                    </tr>
                                    <tr>
                                      <td><strong>Writing:</strong></td>
                                      <td>{test?.writing}</td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </Col>
                            </Row>
                              })
                            }
                            
                          </CardBody>
                        </Card>
                      </div>

                      <div>
                        <h5>Study Preferences</h5>
                        <Card>
                          <CardBody>
                            <Row>
                              <Col md={4}>
                                <p><strong>Preferred Destination:</strong> {userData?.preferred?.destination}</p>
                              </Col>
                              <Col md={4}>
                                <p><strong>Degree Level:</strong> {userData?.preferred?.degree}</p>
                              </Col>
                              <Col md={4}>
                                <p><strong>Start Year:</strong> {userData?.preferred?.start_year}</p>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Documents Tab */}
                <TabPane tabId="3">
                  <h5>Document Verification Status</h5>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Document Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData?.verificationStatus && Object.entries(userData?.verificationStatus).map(([docType, status]) => (
                        <tr key={docType}>
                          <td>
                            {getStatusIcon(status)}
                            <span className="ms-2">
                              {docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </td>
                          <td>{getStatusBadge(status)}</td>
                          <td>
                            <Button size="sm" color="outline-primary" className="me-2">
                              View
                            </Button>
                            {status === 'pending' && (
                              <>
                                <Button size="sm" color="success" className="me-2">
                                  Approve
                                </Button>
                                <Button size="sm" color="danger">
                                  Reject
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TabPane>

                {/* Applications Tab */}
                <TabPane tabId="4">
                  <h5>University Applications</h5>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>University</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th>Applied Date</th>
                        <th>Intake</th>
                        <th>Tuition Fees</th>
                        <th>Deadline</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData?.applications?.length>0 && userData?.applications?.map((app, index) => (
                        <tr key={index}>
                          <td>{app?.universityId?.name}</td>
                          <td>{app?.courseId?.title}</td>
                          <td>{getStatusBadge(app.status)}</td>
                          <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                          <td>{app.intake}</td>
                          <td>{app.currency} {app.tuitionFees}</td>
                          <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                          <td>
                            <Button size="sm" color="outline-primary">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TabPane>

                {/* Admin Actions Tab */}
                <TabPane tabId="5">
                  <Row>
                    <Col md={6}>
                      <Card>
                        <CardHeader>
                          <h5>User Status</h5>
                        </CardHeader>
                        <CardBody>
                          <p><strong>Current Status:</strong> {getStatusBadge(userData?.status)}</p>
                          <p><strong>Uploaded On:</strong> {new Date(userData?.uploadedOn).toLocaleDateString()}</p>
                          {userData?.verifiedOn && (
                            <p><strong>Verified On:</strong> {new Date(userData?.verifiedOn).toLocaleDateString()}</p>
                          )}
                          {userData?.verifiedBy && (
                            <p><strong>Verified By:</strong> {userData?.verifiedBy}</p>
                          )}
                          <div className="mt-3">
                            <Button color="success" className="me-2">Approve User</Button>
                            <Button color="danger" className="me-2">Reject User</Button>
                            <Button color="warning">Mark Under Review</Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <CardHeader>
                          <h5>Admin Remarks</h5>
                        </CardHeader>
                        <CardBody>
                          <div className="mb-3">
                            <label className="form-label">Current Remarks:</label>
                            <p className="form-control-plaintext">{userData?.remarks || 'No remarks added'}</p>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Add New Remark:</label>
                            <textarea className="form-control" rows="3" placeholder="Enter your remarks..."></textarea>
                          </div>
                          <Button color="primary">Update Remarks</Button>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
   </Layout>
  );
};

export default StudentDetails;