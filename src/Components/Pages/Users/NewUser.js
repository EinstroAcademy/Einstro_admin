import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { saveAs } from 'file-saver';
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import "../Students/newStudent.css";
import axios from "axios";
import { countryList } from "../Students/options";
import Select from "react-select";
import { customStyles } from "../Course/Course";
import { format } from "date-fns";

import rightArrow from "../../../Images/icons/right-arrow.svg";
import whiteRightArrow from "../../../Images/icons/white-right-arrow.svg";
import addPlus from "../../../Images/icons/add-plus.svg";
import request, { NodeURL } from "../../../api/api";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import JSZip from "jszip";

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

export const gradeLevelOption = [
  { label: "10th", value: "10th" },
  { label: "12th", value: "12th" },
  { label: "Diploma", value: "Diploma" },
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

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #dd0e3a 100%)',
    padding: '20px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
  },
  mainCard: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden'
  },
  header: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #dd0e3a 100%)',
    color: 'white',
    padding: '30px',
    textAlign: 'center'
  },
  headerTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 10px 0'
  },
  headerSubtitle: {
    fontSize: '1.1rem',
    opacity: '0.9',
    margin: '0'
  },
  body: {
    padding: '30px'
  },
  successAlert: {
    backgroundColor: '#dcfce7',
    border: '1px solid #bbf7d0',
    color: '#166534',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '1rem',
    fontWeight: '500'
  },
  progressSection: {
    marginBottom: '30px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  progressText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0'
  },
  badge: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  documentCard: {
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#fafafa',
    transition: 'all 0.2s ease'
  },
  documentLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px'
  },
  documentIcon: {
    fontSize: '1.5rem',
    marginRight: '8px'
  },
  fileInput: {
    width: '100%',
    padding: '12px',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    backgroundColor: 'white',
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginBottom: '8px'
  },
  helpText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0'
  },
  uploadProgress: {
    marginTop: '12px'
  },
  uploadProgressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e5e7eb',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  uploadProgressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  },
  uploadProgressText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '4px 0 0 0'
  },
  uploadedFile: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px'
  },
  uploadedStatus: {
    color: '#166534',
    fontWeight: '600',
    margin: '0 0 4px 0',
    fontSize: '0.875rem'
  },
  uploadedFileName: {
    color: '#374151',
    fontSize: '0.75rem',
    margin: '0'
  },
  removeButton: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 8px',
    cursor: 'pointer',
    fontSize: '0.75rem'
  },
  submitSection: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginRight: '12px'
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed'
  },
  galleryButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  guidelines: {
    backgroundColor: '#f8fafc',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  guidelinesTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 16px 0'
  },
  guidelinesList: {
    margin: '0',
    paddingLeft: '20px'
  },
  guidelinesItem: {
    color: '#6b7280',
    marginBottom: '8px',
    lineHeight: '1.5'
  },
  // Gallery styles
  galleryContainer: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: '1000',
    overflow: 'auto'
  },
  galleryContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  galleryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    color: 'white'
  },
  galleryTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0'
  },
  galleryActions: {
    display: 'flex',
    gap: '12px'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  closeButton: {
    backgroundColor: '#ef4444'
  },
  downloadButton: {
    backgroundColor: '#10b981'
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  galleryItem: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  galleryItemHeader: {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  galleryItemTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0'
  },
  galleryItemImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    cursor: 'pointer'
  },
  galleryItemActions: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },
  galleryItemButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'transparent',
    color: '#4f46e5',
    border: '1px solid #dd0e3a',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  // Modal styles
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1001',
    padding: '20px'
  },
  modalContent: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh'
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  modalClose: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '1.2rem'
  }
};
const documentTypes = [
  { key: 'class10', label: '10th Standard Certificate', icon: '📜' },
  { key: 'class12', label: '12th Standard Certificate', icon: '📜' },
  { key: 'degree', label: 'Degree Certificate', icon: '🎓' },
  { key: 'aadhaarFront', label: 'Aadhaar Card - Front', icon: '🆔' },
  { key: 'aadhaarBack', label: 'Aadhaar Card - Back', icon: '🆔' },
  { key: 'passportFirst', label: 'Passport - First Page', icon: '📔' },
  { key: 'passportLast', label: 'Passport - Last Page', icon: '📔' },
  { key: 'birthCertificate', label: 'Birth Certificate', icon: '📋' }
];

function NewUser() {
  const location = useLocation()
  const [countryOption, setCountryOption] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [isQualification, setIsQualification] = useState(false);
  const [isSchool, setIschool] = useState(false);
  const [isEnglishTest, setIsEnglishTest] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStudentId, setSaveStudentId] = useState('')
  const [studentDetails, setStudentDetails] = useState({})
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isQualificationOpen, setIsQualificationOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [schoolDeleteConfirm, setSchoolDeleteConfirm] = useState(false);
  const [testDeleteConfirm, setTestDeleteConfirm] = useState(false);
const [deleteIndex, setDeleteIndex] = useState(null);
  const [newUser, setnewUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
  });

  const [qualification, setQualification] = useState({
    degree: '',
    country: '',
    university: '',
    course: '',
    cgpa_level: '',
    score: '',
    medium: '',
    address: ''
  });

  const [school, setSchool] = useState({
    grade: '',
    name: '',
    medium: '',
    course: '',
    address: '',
    score: '',
    cgpa_level: '',
    from: '',
    to: ''
  });

  const [englishTest, setEnglishTest] = useState({
        test:  '',
        overallScore:  '',
        reading:'',
        listening: '',
        speaking:'',
        writing:'',
        overallScore:''
    })

  useEffect(() => {
    if (location?.state?.studentId) {
      setSaveStudentId(location?.state?.studentId)
    }
  }, [location])

  useEffect(() => {
    setCountryOption(
      countryList.map((country) => {
        return { label: country.name, value: country.name };
      })
    );
  }, []);

  const handleChanges = (name, value) => {
    setnewUser({ ...newUser, [name]: value });
  };

  const handleQualificationChange = (field, value) => {
    setQualification(prev => ({ ...prev, [field]: value }));
  };

  const handleSchoolChange = (field, value) => {
    setSchool(prev => ({ ...prev, [field]: value }));
  };

  const handleEnglishTestChange = (name, e) => {
        setEnglishTest({ ...englishTest, [name]: e })
    }


  const handleSavenewUser = () => {
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
      if (!newUser[field] || newUser[field].trim() === "") {
        toast.error(`Please fill in the ${field.replace(/_/g, " ")}`);
        return;
      }
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // DOB validation: at least 17 years old
    const dob = new Date(newUser.dob);
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
    const expiry = new Date(newUser.passport_expiry_date);
    if (expiry <= today) {
      toast.error("Passport expiry date must be in the future.");
      return;
    }

    if (saveStudentId) {
      newUser.userId = saveStudentId
    }

    // Submit data if validation passes
    request({
      url: "/admin/create/new/user",
      method: "POST",
      data: newUser,
    })
      .then((res) => {
        if (res.status === 1) {
          setActiveTab(2);
          toast.success("General Information Saved Successfully");
          setSaveStudentId(res.studentId)
        } else if (res.status === 0) {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while saving data.");
      });
  };



  const handleSubmit = () => {
    const {
      degree,
      country,
      university,
      course,
      cgpa_level,
      score,
      medium,
      address,
      _id
    } = qualification;

    // Basic field validation
    if (!degree || !country || !university || !course || !cgpa_level || !score || !medium) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Score should be a valid number between 1 and 100
    const scoreValue = parseFloat(score);
    if (isNaN(scoreValue) || scoreValue < 1 || scoreValue > 100) {
      toast.error('Score must be a number between 1 and 100');
      return;
    }

    // Optional: check length of address
    if (address && address.length < 3) {
      toast.error('Address should be at least 3 characters long');
      return;
    }
    // Here you can handle add or update logic based on `isEditMode`
    if (isEditMode) {
      request({
        url: '/admin/update/user/qualification',
        method: 'POST',
        data: {
          ...qualification,
          userId: saveStudentId
        }
      }).then((res) => {
        if (res.status === 0) {
          toast.error(res.message)
        }
        if (res.status === 1) {
          toast.success(res.message)
          getStudentDetails()
        }
      })
      // updateQualification(qualification); // your update function
      toast.success('Qualification updated successfully');
    } else {
      console.log(qualification)
      request({
        url: '/admin/update/user/qualification',
        method: 'POST',
        data: {
          ...qualification,
          userId: saveStudentId
        }
      }).then((res) => {
        if (res.status === 0) {
          toast.error(res.message)
        }
        if (res.status === 1) {
          toast.success(res.message)
          getStudentDetails()
        }
      })
    }
    setIsQualification(!isQualification); // close modal
  };

  const handleSubmitSchool = () => {
    const {
      grade,
      name,
      medium,
      course,
      address,
      score,
      cgpa_level,
      from,
      to
    } = school;

    // Required fields
    if (!grade || !name || !medium || !course || !address || !score || !cgpa_level || !from || !to) {
      toast.error("All fields are required.");
      return;
    }

    // Address length
    if (address.length < 5) {
      toast.error("Address should be at least 5 characters long.");
      return;
    }

    // Score validation
    const scoreValue = parseFloat(score);
    if (isNaN(scoreValue) || scoreValue < 1 || scoreValue > 100) {
      toast.error("Score must be a number between 1 and 100.");
      return;
    }

    // Date parsing
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      toast.error("Invalid dates provided.");
      return;
    }

    if (toDate <= fromDate) {
      toast.error("'To' date must be after 'From' date.");
      return;
    }

    // At least 1 year gap
    const yearDiff =
      toDate.getFullYear() - fromDate.getFullYear() +
      (toDate.getMonth() - fromDate.getMonth()) / 12;

    if (yearDiff < 1) {
      toast.error("School duration must be at least 1 year.");
      return;
    }

    // ✅ All validations passed

    request({
      url: '/admin/update/user/school',
      method: 'POST',
      data: {
        ...school,
        userId: saveStudentId
      }
    }).then((res) => {
      if (res.status === 1) {
        toast.success("School details submitted successfully.");
        setIschool(!isSchool)
        getStudentDetails()
        setSchool({
          grade: '',
          name: '',
          medium: '',
          course: '',
          address: '',
          score: '',
          cgpa_level: '',
          from: '',
          to: ''
        })
      }
      if (res.status === 0) {
        toast.error(res.messsage)
      }
    }).catch((err) => {
      console.log(err)
    })
    // Call backend API here
    // submitSchoolData(school);
  };



  const getStudentDetails = () => {
    request({
      url: '/admin/get/user',
      method: 'POST',
      data: {
        userId: saveStudentId
      }
    }).then((res) => {
      setStudentDetails(res.student)
      setnewUser(res.student)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    if (saveStudentId) {
      getStudentDetails()
    }
  }, [saveStudentId])


  const onEditQualification = (detail) => {
    console.log(detail)
    setIsQualification(!isQualification)
    setIsEditMode(true)
    setQualification(detail)
  }

  const onEditSchool = (detail) => {
    console.log(detail)
    setIschool(!isSchool)
    setIsEditMode(true)
    setSchool(detail)
  }

    const onEditEnglishTest = (detail) => {
    console.log(detail)
    setIsEnglishTest(!isEnglishTest)
    setIsEditMode(true)
    setEnglishTest(detail)
  }

  const handleFileUpload = (docType, file) => {
    if (file) {
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [docType]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[docType] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            setUploadedFiles(prevFiles => ({ ...prevFiles, [docType]: file }));
            return { ...prev, [docType]: 100 };
          }
          return { ...prev, [docType]: currentProgress + 10 };
        });
      }, 100);
    }
  };


  const removeFile = (docType) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[docType];
      return newFiles;
    });
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[docType];
      return newProgress;
    });
  };


  const handleFileSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    console.log(uploadedFiles)

    uploadedFiles.userId = saveStudentId

    const formData = new FormData()
    Object.entries(uploadedFiles).forEach(([key, file]) => {
      formData.append(key, file);
    });

    // Log FormData contents for demonstration
    console.log('FormData contents:');
    request({
      url: '/admin/user/upload/documents',
      method: 'POST',
      data: formData
    }).then((res) => {
      if (res.status === 1) {
        toast.success(res.message)
        getStudentDetails()
      }
      if (res.status === 0) {
        toast.error(res.message)
      }
    })
  };

  const getUploadedCount = () => Object.keys(uploadedFiles).length;


  const openGallery = () => {
    if (getUploadedCount() > 0) {
      setShowGallery(true);
    }
  };

  const closeGallery = () => {
    setShowGallery(false);
    setSelectedImage(null);
  };


  const handleDownload = async () => {
    const zip = new JSZip();
    const folder = zip.folder(`${studentDetails?.firstName}_student_documents`);

    const entries = Object.entries(studentDetails?.documents);

    for (const [docName, filePath] of entries) {
      try {
        const fileName = filePath.split('/').pop();
        const response = await axios.get(`${NodeURL}/${filePath}`, {
          responseType: 'blob'
        });

        folder.file(`${studentDetails?.firstName}_${docName}`, response.data);
      } catch (error) {
        console.error(`Failed to fetch ${docName}:`, error);
      }
    }

    // Generate ZIP and trigger download
    zip.generateAsync({ type: 'blob' })
      .then(content => {
        saveAs(content, 'student_documents.zip');
      });
  };


  const downloadSingle = async (filename, filePath) => {
    try {
      const response = await axios.get(`${NodeURL}/${filePath}`, {
        responseType: 'blob',
      });

      saveAs(response.data, filename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };


  const openImageModal = (fileData) => {
    setSelectedImage(fileData);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const getDocumentLabel = (key) => {
    const docType = documentTypes.find(doc => doc.key === key);
    return docType ? docType.label : key;
  };

  const handleDeleteClick = (qualification, index) => {
  setSelectedQualification(qualification);
  setDeleteIndex(index);
  setShowDeleteConfirm(true);
};

const handleSchoolDeleteClick = (school, index) => {
  setSelectedSchool(school);
  setDeleteIndex(index);
  setSchoolDeleteConfirm(true);
};


const handleTestDeleteClick = (school, index) => {
  setSelectedTest(school);
  setDeleteIndex(index);
  setTestDeleteConfirm(true);
};


const confirmDelete = () => {
  if (deleteIndex !== null) {
    request({
      url:'/admin/user/remove/qualification',
      method:'POST',
      data:{
        qualificationId:selectedQualification?._id,
        userId:saveStudentId
      }
    }).then((res)=>{
      if(res.status===1){
        setDeleteIndex('')
        setShowDeleteConfirm(false)
        setSelectedQualification({})
        toast.success('Qualification deleted successfully');
        getStudentDetails()
       }
    })
    // Optional: Show success message
    // toast.success('Qualification deleted successfully');
  }
};

const confirmSchoolDelete = () => {
  if (deleteIndex !== null) {
    request({
      url:'/admin/user/remove/school',
      method:'POST',
      data:{
        schoolId:selectedSchool?._id,
        userId:saveStudentId
      }
    }).then((res)=>{
      if(res.status===1){
        setDeleteIndex('')
        setSchoolDeleteConfirm(false)
        setSelectedSchool({})
        toast.success('School deleted successfully');
        getStudentDetails()
       }
    })
    // Optional: Show success message
    // toast.success('Qualification deleted successfully');
  }
};

const confirmTestDelete = () => {
  if (deleteIndex !== null) {
    request({
      url:'/admin/user/remove/test',
      method:'POST',
      data:{
        testId:selectedTest?._id,
        userId:saveStudentId
      }
    }).then((res)=>{
      if(res.status===1){
        setDeleteIndex('')
        setTestDeleteConfirm(false)
        setSelectedTest({})
        toast.success('Test deleted successfully');
        getStudentDetails()
       }
    })
    // Optional: Show success message
    // toast.success('Qualification deleted successfully');
  }
};


const handleSubmitEnglishTest =()=>{
  request({
    url:'/admin/update/user/english/test',
    method:'POST',
    data:{
      ...englishTest,
      userId:saveStudentId
    }
  }).then((res)=>{
    if(res.status===1){
      toast.success("Exam details updated successfully");
      setIsEnglishTest(false)
      getStudentDetails()
    }
    if(res.status===0){
      toast.error(res.message);
    }
  })
}


  return (
    <Layout>
      <div className="container-fluid new-std-container">
        <h4 className="new-std-head">{saveStudentId ? 'Edit' : 'New'} User Details</h4>
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
            {/* <NavItem>
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
            <NavItem>
              <NavLink
                className={`${activeTab === 6 ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(6);
                }}
              >
                Documents
              </NavLink>
            </NavItem> */}
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
                      value={newUser?.firstName}
                      onChange={(e) =>
                        handleChanges("firstName", e.target.value)
                      }
                    />
                  </div>
                </Col>
                <Col lg="4">
                  <label>Middle Name</label>
                  <div>
                    <input
                      type="text"
                      className="std-input-control"
                      value={newUser?.middleName}
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
                      value={newUser?.lastName}
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
                      value={newUser?.email}
                      onChange={(e) => handleChanges("email", e.target.value)}
                    />
                  </div>
                </Col>
                <Col lg="4">
                  <label>
                    Password<span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      type="password"
                      className="std-input-control"
                      value={newUser?.password}
                      onChange={(e) => handleChanges("email", e.target.value)}
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
                      value={newUser?.address}
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
                      value={newUser?.city}
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
                      value={countryOption?.find((li) => li.value === newUser?.country)}
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
                      value={newUser?.state}
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
                      value={newUser?.postalCode}
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
                  onClick={() => handleSavenewUser()}
                >
                  {saveStudentId ? 'Save' : "New"} <img src={whiteRightArrow} />
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
                <div className="my-5">
                  {
                    newUser?.qualification?.length > 0 && newUser?.qualification?.map((detail,indx) => {
                      return <Card className="mb-3 shadow-sm border-0">
                        <CardBody>
                          <CardTitle tag="h5" className="mb-3">
                            {detail?.degree} - {detail?.course}
                          </CardTitle>
                          <Row>
                            <Col md={6}>
                              <CardText><strong>University:</strong> {detail?.university}</CardText>
                              <CardText><strong>Country:</strong> {detail?.country}</CardText>
                              <CardText><strong>Grade Scheme:</strong> {detail?.cgpa_level}</CardText>
                              <CardText><strong>Score:</strong> {detail?.score}</CardText>
                              <CardText><strong>Duration:</strong> {detail?.from ? format(new Date(detail?.from),'yyyy') :''} - {detail?.to ? format(new Date(detail?.to),'yyyy') :''}</CardText>
                            </Col>
                            <Col md={6}>
                              <CardText><strong>Language of Instruction:</strong> {detail?.medium}</CardText>
                              <CardText><strong>Address:</strong> {detail?.address}</CardText>
                              <CardText><strong>User ID:</strong> {newUser?.studentId}</CardText>
                            </Col>
                          </Row>
                          <div className="d-flex justify-content-end gap-2 mt-3">
                            <Button color="primary" size="sm" onClick={() => onEditQualification(detail)}>Edit</Button>
                            <Button color="danger" size="sm" onClick={()=>handleDeleteClick (detail,indx)}>Delete</Button>
                          </div>
                        </CardBody>
                      </Card>
                    })
                  }

                </div>
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
                  {isEditMode ? 'Edit Qualification' : 'Add Qualification'}
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
                              value={qualificationOption.find(op => op.value === qualification?.degree)}
                              onChange={(e) => handleQualificationChange('degree', e.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3} lg={3}>
                          <FormGroup>
                            <Label>From Date</Label>
                            <div>
                              <DatePicker
                                selected={qualification?.from ? new Date(qualification?.from) : ''}
                                placeholderText="Select From Date"
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                className="school-to-date"
                                maxDate={new Date()}
                                onChange={(e) => handleQualificationChange('from', e)}
                              />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md={3} lg={3}>
                          <FormGroup>
                            <Label>To Date</Label>
                            <div>
                              <DatePicker
                                selected={qualification?.to ? new Date(qualification?.to) : ''}
                                placeholderText="Select To Date"
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                maxDate={new Date()}
                                className="school-to-date"
                                onChange={(e) => handleQualificationChange('to', e)}
                              />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="country">Country</Label>
                            <Select
                              styles={customStyles}
                              options={countryOptions}
                              value={countryOptions.find(e => e.value === qualification?.country)}
                              onChange={(e) => handleQualificationChange('country', e.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label >University/College</Label>
                            <Input
                              type="text"
                              value={qualification?.university}
                              placeholder="University"
                              onChange={(e) => handleQualificationChange('university', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Course</Label>
                            <Input type="text"
                              value={qualification?.course}
                              placeholder="Course"
                              onChange={(e) => handleQualificationChange('course', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Language of Instruction</Label>
                            <Select
                              styles={customStyles}
                              options={schoolMediumOption}
                              value={schoolMediumOption.find(op => op.value === qualification?.medium)}
                              onChange={(e) => handleQualificationChange('medium', e.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="GradeScheme">Grade Scheme</Label>
                            <Select
                              styles={customStyles}
                              options={gradeOption}
                              value={gradeOption.find(op => op.value === qualification?.cgpa_level)}
                              onChange={(e) => handleQualificationChange('cgpa_level', e.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Score</Label>
                            <Input type="text"
                              value={qualification?.score}
                              placeholder="Score (1–100)"
                              onChange={(e) => handleQualificationChange('score', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col md={12}>
                          <FormGroup>
                            <Label >Address</Label>
                            <Input type="text"
                              value={qualification?.address}
                              placeholder="Address"
                              onChange={(e) => handleQualificationChange('address', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="d-flex gap-3 mt-4">
                        <Button className='discard-btn'
                          onClick={() => setIsQualification(!isQualification)}
                        >Discard</Button>
                        <Button className='save-btn'
                          onClick={handleSubmit}
                        >{isEditMode ? 'Update' : 'Save'}</Button>
                      </div>
                    </div>



                  </div>
                </ModalBody>
              </Modal>
            </div>
          </TabPane>
          <TabPane tabId={3}>
            <div className="container-fluid">
              <div>
                <button className="qlf-new-btn" onClick={() => setIschool(!isSchool)}>
                  <img src={addPlus} />
                  Add New
                </button>
                <div className="my-5">
                  {
                    newUser?.school?.length > 0 && newUser?.school?.map((detail,indx) => {
                      return <Card className="mb-3 shadow-sm border-0">
                        <CardBody>
                          <CardTitle tag="h5" className="mb-3">
                            {detail?.grade} - {detail?.course}
                          </CardTitle>
                          <Row>
                            <Col md={6}>
                              <CardText><strong>School Name:</strong> {detail?.name}</CardText>
                              <CardText><strong>Language of Instruction:</strong> {detail?.medium}</CardText>
                              <CardText><strong>Grade Scheme:</strong> {detail?.cgpa_level}</CardText>
                              <CardText><strong>Score:</strong> {detail?.score}</CardText>
                            </Col>
                            <Col md={6}>
                              <CardText><strong>Address:</strong> {detail?.address}</CardText>
                              <CardText><strong>User ID:</strong> {newUser?.studentId}</CardText>
                            </Col>
                          </Row>
                          <div className="d-flex justify-content-end gap-2 mt-3">
                            <Button color="primary" size="sm" onClick={() => onEditSchool(detail)}>Edit</Button>
                            <Button color="danger" size="sm" onClick={()=>handleSchoolDeleteClick(detail,indx)}>Delete</Button>
                          </div>
                        </CardBody>
                      </Card>
                    })
                  }

                </div>
              </div>
              <Modal
                isOpen={isSchool}
                toggle={() => setIschool(!isSchool)}
                centered
                size="lg"
              >
                <ModalHeader
                  toggle={() => setIschool(!isSchool)}
                >
                  {isEditMode ? 'Edit School' : 'Add School'}
                </ModalHeader>
                <ModalBody>
                  <div className='container'>
                    <div className='my-3'>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="fullName">Grade Level</Label>
                            <Select
                              styles={customStyles}
                              options={gradeLevelOption}
                              value={gradeLevelOption.find(op => op.value === school?.grade)}
                              onChange={(e) => handleSchoolChange('grade', e.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3} lg={3}>
                          <FormGroup>
                            <Label>From Date</Label>
                            <div>
                              <DatePicker
                                selected={school?.from ? new Date(school?.from) : ''}
                                placeholderText="Select From Date"
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                className="school-to-date"
                                maxDate={new Date()}
                                onChange={(e) => handleSchoolChange('from', e)}
                              />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md={3} lg={3}>
                          <FormGroup>
                            <Label>To Date</Label>
                            <div>
                              <DatePicker
                                selected={school?.to ? new Date(school?.to) : ''}
                                placeholderText="Select To Date"
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                maxDate={new Date()}
                                className="school-to-date"
                                onChange={(e) => handleSchoolChange('to', e)}
                              />
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label >School Name</Label>
                            <Input
                              type="text"
                              value={school?.name}
                              placeholder="School Name"
                              onChange={(e) => handleSchoolChange('name', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Course/Subject/Group</Label>
                            <Input type="text"
                              value={school?.course}
                              placeholder="Course"
                              onChange={(e) => handleSchoolChange('course', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Language of Instruction</Label>
                            <Select
                              styles={customStyles}
                              options={schoolMediumOption}
                              value={schoolMediumOption.find(op => op.value === school?.medium)}
                              onChange={(e) => handleSchoolChange('medium', e.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="GradeScheme">Grade Scheme</Label>
                            <Select
                              styles={customStyles}
                              options={gradeOption}
                              value={gradeOption.find(op => op.value === school?.cgpa_level)}
                              onChange={(e) => handleSchoolChange('cgpa_level', e.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Score</Label>
                            <Input type="text"
                              value={school?.score}
                              placeholder=""
                              onChange={(e) => handleSchoolChange('score', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col md={12}>
                          <FormGroup>
                            <Label >Address</Label>
                            <Input type="text"
                              value={school?.address}
                              placeholder="Address"
                              onChange={(e) => handleSchoolChange('address', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="d-flex gap-3 mt-4">
                        <Button className='discard-btn'
                          onClick={() => setIschool(!isSchool)}
                        >Discard</Button>
                        <Button className='save-btn'
                          onClick={handleSubmitSchool}
                        >{isEditMode ? 'Update' : 'Save'}</Button>
                      </div>
                    </div>



                  </div>
                </ModalBody>
              </Modal>
              <Modal
                isOpen={showDeleteConfirm}
                toggle={() => setShowDeleteConfirm(false)}
                centered
                size="sm"
              >
                <ModalHeader toggle={() => setShowDeleteConfirm(false)}>
                  Confirm Delete
                </ModalHeader>
                <ModalBody>
                  <div className="text-center">
                    <div className="mb-3">
                      <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5>Are you sure?</h5>
                    <p className="text-muted">
                      Do you want to delete this qualification? This action cannot be undone.
                    </p>
                    {selectedQualification && (
                      <div className="alert alert-light mt-3">
                        <strong>{selectedQualification.degree} - {selectedQualification.course}</strong><br />
                        <small className="text-muted">{selectedQualification.university}</small>
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    No, Cancel
                  </Button>
                  <Button
                    color="danger"
                    onClick={confirmDelete}
                  >
                    Yes, Delete
                  </Button>
                </ModalFooter>
              </Modal>
              <Modal
                isOpen={schoolDeleteConfirm}
                toggle={() => setShowDeleteConfirm(false)}
                centered
                size="sm"
              >
                <ModalHeader toggle={() => setShowDeleteConfirm(false)}>
                  Confirm Delete
                </ModalHeader>
                <ModalBody>
                  <div className="text-center">
                    <div className="mb-3">
                      <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5>Are you sure?</h5>
                    <p className="text-muted">
                      Do you want to delete this School? This action cannot be undone.
                    </p>
                    
                    {selectedSchool && (
                      <div className="alert alert-light mt-3">
                        <strong>{selectedSchool.name} - {selectedSchool.course}</strong><br />
                        {/* <small className="text-muted">{selectedSchool.name}</small> */}
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    onClick={() => setSchoolDeleteConfirm(false)}
                  >
                    No, Cancel
                  </Button>
                  <Button
                    color="danger"
                    onClick={confirmSchoolDelete}
                  >
                    Yes, Delete
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </TabPane>
          <TabPane tabId={4}>
            <div className="container-fluid">
              <div>
                <button className="qlf-new-btn" onClick={() => setIsEnglishTest(!isEnglishTest)}>
                  <img src={addPlus} />
                  Add New
                </button>
                <div className="my-5">
                  {
                    newUser?.englishTest?.length > 0 && newUser?.englishTest?.map((data,indx) => {
                      return (
                        <div className="card shadow-sm p-3 mb-3">
                          <h6 className="fw-bold mb-2">
                            {data.test} -
                            {data.exam_date
                              ? new Date(data.exam_date).toLocaleDateString()
                              : "—"}
                          </h6>
                          <h6 className="fw-bold mb-2">
                            Over all score - 
                            {data?.overallScore}
                          </h6>
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1">
                                <strong>Listening:</strong> {data.listening}
                              </p>
                              <p className="mb-1">
                                <strong>Reading:</strong> {data.reading}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1">
                                <strong>Writing:</strong> {data.writing}
                              </p>
                              <p className="mb-1">
                                <strong>Speaking:</strong> {data.speaking}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end gap-2 mt-3">
                            <Button color="primary" size="sm" onClick={() => onEditEnglishTest(data)}>Edit</Button>
                            <Button color="danger" size="sm" onClick={()=>handleTestDeleteClick(data,indx)}>Delete</Button>
                          </div>
                        </div>
                      );
                    })
                  }

                </div>
              </div>
              <Modal
                isOpen={isEnglishTest}
                toggle={() => setIsEnglishTest(!isEnglishTest)}
                centered
                size="lg"
              >
                <ModalHeader
                  toggle={() => setIsEnglishTest(!isEnglishTest)}
                >
                  {isEditMode ? 'Edit Test' : 'Add Test'}
                </ModalHeader>
                <ModalBody>
                  <div className='container'>
                    <div className='my-3'>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="fullName">Grade Level</Label>
                            <Select
                              styles={customStyles}
                              options={englishTestOption}
                              value={englishTestOption.find(op => op.value === englishTest?.test)}
                              onChange={(e) => handleEnglishTestChange('test', e.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3} lg={3}>
                          <FormGroup>
                            <Label>Exam Date</Label>
                            <div>
                              <DatePicker
                                selected={englishTest?.exam_date ? new Date(englishTest?.exam_date) : ''}
                                placeholderText="Select From Date"
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                className="school-to-date"
                                maxDate={new Date()}
                                onChange={(e) => handleEnglishTestChange('exam_date', e)}
                              />
                            </div>
                          </FormGroup>
                        </Col>
                         <Col md={6}>
                          <FormGroup>
                            <Label >Overall Score</Label>
                            <Input type="text"
                             value={englishTest?.overallScore}
                              placeholder="Overall Score"
                              onChange={(e) => handleEnglishTestChange('overallScore', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Listening Score</Label>
                            <Input
                              type="text"
                              value={englishTest?.listening}
                              placeholder="Listening"
                              onChange={(e) => handleEnglishTestChange('listening', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Reading</Label>
                            <Input type="text"
                             value={englishTest?.reading}
                              placeholder="Reading"
                              onChange={(e) => handleEnglishTestChange('reading', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Writing</Label>
                            <Input type="text"
                             value={englishTest?.writing}
                              placeholder="Reading"
                              onChange={(e) => handleEnglishTestChange('writing', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label >Speaking</Label>
                            <Input type="text"
                             value={englishTest?.speaking}
                              placeholder="Reading"
                              onChange={(e) => handleEnglishTestChange('speaking', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr />
                      <div className="d-flex gap-3 mt-4">
                        <Button className='discard-btn'
                          onClick={() => setIsEnglishTest(!isEnglishTest)}
                        >Discard</Button>
                        <Button className='save-btn'
                          onClick={handleSubmitEnglishTest}
                        >{isEditMode ? 'Update' : 'Save'}</Button>
                      </div>
                    </div>



                  </div>
                </ModalBody>
              </Modal>
              <Modal
                isOpen={showDeleteConfirm}
                toggle={() => setShowDeleteConfirm(false)}
                centered
                size="sm"
              >
                <ModalHeader toggle={() => setShowDeleteConfirm(false)}>
                  Confirm Delete
                </ModalHeader>
                <ModalBody>
                  <div className="text-center">
                    <div className="mb-3">
                      <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5>Are you sure?</h5>
                    <p className="text-muted">
                      Do you want to delete this qualification? This action cannot be undone.
                    </p>
                    {selectedQualification && (
                      <div className="alert alert-light mt-3">
                        <strong>{selectedQualification.degree} - {selectedQualification.course}</strong><br />
                        <small className="text-muted">{selectedQualification.university}</small>
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    No, Cancel
                  </Button>
                  <Button
                    color="danger"
                    onClick={confirmDelete}
                  >
                    Yes, Delete
                  </Button>
                </ModalFooter>
              </Modal>
              <Modal
                isOpen={schoolDeleteConfirm}
                toggle={() => setShowDeleteConfirm(false)}
                centered
                size="sm"
              >
                <ModalHeader toggle={() => setShowDeleteConfirm(false)}>
                  Confirm Delete
                </ModalHeader>
                <ModalBody>
                  <div className="text-center">
                    <div className="mb-3">
                      <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5>Are you sure?</h5>
                    <p className="text-muted">
                      Do you want to delete this School? This action cannot be undone.
                    </p>
                    
                    {selectedSchool && (
                      <div className="alert alert-light mt-3">
                        <strong>{selectedSchool.name} - {selectedSchool.course}</strong><br />
                        {/* <small className="text-muted">{selectedSchool.name}</small> */}
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    onClick={() => setSchoolDeleteConfirm(false)}
                  >
                    No, Cancel
                  </Button>
                  <Button
                    color="danger"
                    onClick={confirmSchoolDelete}
                  >
                    Yes, Delete
                  </Button>
                </ModalFooter>
              </Modal>
              <Modal
                isOpen={testDeleteConfirm}
                toggle={() => setTestDeleteConfirm(false)}
                centered
                size="sm"
              >
                <ModalHeader toggle={() => setTestDeleteConfirm(false)}>
                  Confirm Delete
                </ModalHeader>
                <ModalBody>
                  <div className="text-center">
                    <div className="mb-3">
                      <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5>Are you sure?</h5>
                    <p className="text-muted">
                      Do you want to delete this Test? This action cannot be undone.
                    </p>
                    
                    {selectedTest && (
                      <div className="alert alert-light mt-3">
                        <strong>{selectedTest.test}</strong><br />
                        {/* <small className="text-muted">{selectedSchool.name}</small> */}
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    onClick={() => setTestDeleteConfirm(false)}
                  >
                    No, Cancel
                  </Button>
                  <Button
                    color="danger"
                    onClick={confirmTestDelete}
                  >
                    Yes, Delete
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </TabPane>
          <TabPane tabId={6}>
            <div >


              {showGallery ? (
                <div style={styles.galleryContainer}>
                  <div style={styles.galleryContent}>
                    <div style={styles.galleryHeader}>
                      <h2 style={styles.galleryTitle}>📸 Document Gallery</h2>
                      <div style={styles.galleryActions}>
                        <button
                          onClick={handleDownload}
                          style={{ ...styles.actionButton, ...styles.downloadButton }}
                        >
                          {/* <Download size={16} /> */}
                          Download All
                        </button>
                        <button
                          onClick={closeGallery}
                          style={{ ...styles.actionButton, ...styles.closeButton }}
                        >
                          {/* <X size={16} /> */}
                          Close
                        </button>
                      </div>
                    </div>

                    <div style={styles.galleryGrid}>
                      {Object.entries(studentDetails?.documents).map(([key, fileData]) => (
                        <div key={key} style={styles.galleryItem}  onClick={() => openImageModal(fileData)}>
                          <div style={styles.galleryItemHeader}>
                            <h3 style={styles.galleryItemTitle}>{getDocumentLabel(key)}</h3>
                          </div>

                          {fileData ? (
                            <img
                              src={`${NodeURL}/${fileData}`}
                              alt={getDocumentLabel(key)}
                              style={styles.galleryItemImage}
                              onClick={() => openImageModal(fileData)}
                            />
                          ) : (
                            <div style={{
                              ...styles.galleryItemImage,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f3f4f6',
                              color: '#6b7280'
                            }}>
                              {/* <FileText size={48} /> */}
                            </div>
                          )}

                          <div style={styles.galleryItemActions}>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {key}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {key.toLowerCase().match(/\.(jpg|jpeg|png)$/) && (
                                <button
                                  onClick={() => openImageModal(fileData)}
                                  style={styles.galleryItemButton}
                                >
                                  {/* <Eye size={12} /> */}
                                  View
                                </button>
                              )}
                              <button
                                onClick={() => downloadSingle(key, fileData)}
                                style={styles.galleryItemButton}
                              >
                                {/* <Download size={12} /> */}
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) :
                studentDetails?.documents?.class10 ? <div>
                  <h3>Document Uploaded Successfully</h3>
                  <button 
                  onClick={() => setShowGallery(!showGallery)} 
                  style={{ ...styles.actionButton, ...styles.downloadButton }}>Show Docs</button>
                </div> :
                  <div style={styles.container}>
                    <div style={styles.mainCard}>
                      <div style={styles.header}>
                        <h1 style={styles.headerTitle}>📄 Document Upload Portal</h1>
                        <p style={styles.headerSubtitle}>Upload your required documents securely</p>
                      </div>

                      <div style={styles.body}>
                        {showSuccess && (
                          <div style={styles.successAlert}>
                            ✅ Documents uploaded successfully!
                          </div>
                        )}

                        <div style={styles.progressSection}>
                          <div style={styles.progressHeader}>
                            <p style={styles.progressText}>Upload Progress</p>
                            <span style={styles.badge}>{getUploadedCount()}/{documentTypes.length} completed</span>
                          </div>
                          <div style={styles.progressBar}>
                            <div
                              style={{
                                ...styles.progressFill,
                                width: `${(getUploadedCount() / documentTypes.length) * 100}%`
                              }}
                            />
                          </div>
                        </div>

                        <div style={styles.grid}>
                          {documentTypes.map((docType) => (
                            <div key={docType.key} style={styles.documentCard}>
                              <div style={styles.documentLabel}>
                                <span style={styles.documentIcon}>{docType.icon}</span>
                                {docType.label}
                              </div>

                              {!uploadedFiles[docType.key] ? (
                                <div>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileUpload(docType.key, e.target.files[0])}
                                    style={styles.fileInput}
                                  />
                                  <p style={styles.helpText}>
                                    Accepted formats: PDF, JPG, PNG (Max 5MB)
                                  </p>

                                  {uploadProgress[docType.key] !== undefined && uploadProgress[docType.key] < 100 && (
                                    <div style={styles.uploadProgress}>
                                      <div style={styles.uploadProgressBar}>
                                        <div
                                          style={{
                                            ...styles.uploadProgressFill,
                                            width: `${uploadProgress[docType.key]}%`
                                          }}
                                        />
                                      </div>
                                      <p style={styles.uploadProgressText}>Uploading... {uploadProgress[docType.key]}%</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div style={styles.uploadedFile}>
                                  <div>
                                    <p style={styles.uploadedStatus}>✓ Uploaded</p>
                                    <p style={styles.uploadedFileName}>{uploadedFiles[docType.key].name}</p>
                                  </div>
                                  <button
                                    style={styles.removeButton}
                                    onClick={() => removeFile(docType.key)}
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div style={styles.submitSection}>
                          <button
                            onClick={handleFileSubmit}
                            disabled={getUploadedCount() < 8}
                            style={{
                              ...styles.submitButton,
                              ...(getUploadedCount() < 8 ? styles.submitButtonDisabled : {})
                            }}
                          >
                            {getUploadedCount() < 8 ? 'Upload All Documents' : `Submit ${getUploadedCount()} Document${getUploadedCount() > 1 ? 's' : ''}`}
                          </button>
                        </div>

                        <div style={styles.guidelines}>
                          <h3 style={styles.guidelinesTitle}>📋 Important Guidelines:</h3>
                          <ul style={styles.guidelinesList}>
                            <li style={styles.guidelinesItem}>Ensure all documents are clear and readable</li>
                            <li style={styles.guidelinesItem}>File size should not exceed 5MB per document</li>
                            <li style={styles.guidelinesItem}>Accepted formats: PDF, JPG, JPEG, PNG</li>
                            <li style={styles.guidelinesItem}>For Aadhaar card, upload both front and back sides separately</li>
                            <li style={styles.guidelinesItem}>For passport, upload first page (photo page) and last page separately</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
              }
            </div>
          </TabPane>
        </TabContent>
      </div>
    </Layout>
  );
}

export default NewUser;
