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

export const currencyOption = [
  {
    label: 'UK',
    value: {
      code: "GBP",
      symbol: "£",
      name: "British Pound",
      country: 'UK'
    },
  },
  {
    label: 'USA',
    value: {
      code: "USD",
      symbol: "$",  
      name: "US Dollar",
      country: 'USA'
    },
  },
  {
    label: 'Australia',
    value: {
      code: "AUD",
      symbol: "A$",
      name: "Australian Dollar",
      country: 'Australia'
    },
  },
  {
    label: 'Canada',
    value: {
      code: "CAD",
      symbol: "C$",
      name: "Canadian Dollar",
      country: 'Canada'
    },
  },
  {
    label: 'Germany',
    value: {
      code: "EUR", // Fixed: was AUD
      symbol: "€", // Fixed: was A$
      name: "Euro", // Fixed: was Australian Dollar
      country: 'Germany'
    },
  },
  {
    label: 'France',
    value: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
      country: 'France'
    },
  },
  {
    label: 'Ireland',
    value: {
      code: "EUR",
      symbol: "€", 
      name: "Euro",
      country: 'Ireland'
    },
  },
];

function University() {
  const [pages, setPages] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [currPage, setCurrPage] = useState(25);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(4);
  const [list, setList] = useState([]);
  const [isUniversity, setIsUniversity] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  
  const [newUniversity, setNewUniversity] = useState({
    name: '',
    location: '',
    country: '', // Added missing country field
    currency: {
      code: '',
      symbol: '',
      name: '',
      country: ''
    },
    images: [],
    newImages: [],
    details: '',
    students: '',
    costOfLiving: '',
    rank: '',
    removedImages: [],
    cost: '',
    scholarship: '',
    requirements: ''
  });

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
        setPages(res.response.fullcount);
        setCurrPage(res.response.length);
      } else if (res && +res.status === 0) {
        setList(res.response.result);
        setPages(res.response.fullcount);
        setCurrPage(res.response.length);
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
      setActivePage(data);
      setCurrPage(limit);
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
    setNewUniversity({
      ...newUniversity,
      [name]: value
    });
  };

  const validateForm = () => {
    const { name, location, country, currency, rank, costOfLiving, students, details } = newUniversity;
    
    const validations = [
      { field: name, message: "Name required" },
      { field: location, message: "Location required" },
      { field: country, message: "Country required" },
      { field: currency?.code, message: "Currency required" },
      { field: rank, message: "Rank required" },
      { field: costOfLiving, message: "Cost of Living required" },
      { field: students, message: "Students required" },
      { field: details, message: "Details required" }
    ];

    for (const validation of validations) {
      if (!validation.field || validation.field === "") {
        toast.error(validation.message);
        return false;
      }
    }
    return true;
  };

  const onSubmitBlog = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    
    // Create a copy to avoid mutating state
    const universityData = { ...newUniversity };
    universityData.currency = JSON.stringify(universityData.currency);

    // Append all fields except images first
    Object.entries(universityData).forEach(([key, value]) => {
      if (key !== "images") {
        formData.append(key, value);
      }
    });

    // Append images separately
    if (universityData.images && universityData.images.length > 0) {
      universityData.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    request({
      url: '/admin/create/university',
      method: 'POST',
      data: formData,
    }).then((res) => {
      if (res.status === 1) {
        toast.success("University created successfully");
        closeUniversity();
        getAllUniversityList();
      }
      if (res.status === 0) {
        toast.error(res.message);
      }
    });
  };

  const editUniversity = (data) => {
    setNewUniversity({
      ...data,
      currency: data.currency || {
        code: '',
        symbol: '',
        name: '',
        country: ''
      },
      newImages: [],
      removedImages: []
    });
    
    // Set existing images for display
    if (data.images && data.images.length > 0) {
      const existingImageUrls = data.images.map(img => `${NodeURL}/${img}`);
      setSelectedImages(existingImageUrls);
    }
    
    setIsUniversity(true);
  };

  const onSubmitEditUni = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    
    // Create a copy to avoid mutating state
    const universityData = { ...newUniversity };
    universityData.currency = JSON.stringify(universityData.currency);
    universityData.images = JSON.stringify(universityData.images);
    
    if (universityData?.removedImages?.length > 0) {
      universityData.removedImages = JSON.stringify(universityData.removedImages);
    }

    // Append all fields except newImages first
    Object.entries(universityData).forEach(([key, value]) => {
      if (key !== "newImages") {
        formData.append(key, value);
      }
    });

    // Append new images separately
    if (universityData.newImages && universityData.newImages.length > 0) {
      universityData.newImages.forEach((file) => {
        formData.append("newImages", file);
      });
    }

    request({
      url: '/admin/update/university',
      method: 'POST',
      data: formData,
    }).then((res) => {
      if (res.status === 1) {
        toast.success("University Updated successfully");
        closeUniversity();
        getAllUniversityList();
      }
      if (res.status === 0) {
        toast.error(res.message);
      }
    });
  };

  const onDelete = (id) => {
    setDeleteId(id);
  };

  const deleteSubject = (e, item) => {
    e.stopPropagation();
    request({
      url: '/admin/university/remove',
      method: 'POST',
      data: { universityId: item._id }
    }).then((res) => {
      if (res.status === 1) {
        toast.success("University Deleted successfully");
        setDeleteId('');
        getAllUniversityList();
      }
      if (res.status === 0) {
        toast.error(res.message);
      }
    });
  };

  const handleImageUpload = (event) => {
    const selectedFiles = event.target.files;
    
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Validate file sizes
    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].size > 1048576) { // 1MB
        toast.error("Maximum Image Size 1mb each photo");
        return;
      }
    }

    // Validate total count
    const currentImageCount = (newUniversity.images?.length || 0) + (newUniversity.newImages?.length || 0);
    if (currentImageCount + selectedFiles.length > 10) {
      toast.error("Maximum upload 10 Images");
      return;
    }

    const selectedFilesArray = Array.from(selectedFiles);
    
    // Create preview URLs
    const newImageUrls = selectedFilesArray.map((file) => URL.createObjectURL(file));
    
    if (newUniversity._id) {
      // Editing mode - add to newImages
      setNewUniversity({ 
        ...newUniversity, 
        newImages: [...(newUniversity.newImages || []), ...selectedFilesArray] 
      });
    } else {
      // Creating mode - add to images
      setNewUniversity({ 
        ...newUniversity, 
        images: [...(newUniversity.images || []), ...selectedFilesArray] 
      });
    }
    
    // Add to preview images
    setSelectedImages(prev => [...prev, ...newImageUrls]);
    
    // Clear the input
    event.target.value = '';
  };

  const closeUniversity = () => {
    setIsUniversity(false);
    setNewUniversity({
      name: '',
      location: '',
      country: '',
      currency: {
        code: '',
        symbol: '',
        name: '',
        country: ''
      },
      images: [],
      newImages: [],
      details: '',
      students: '',
      costOfLiving: '',
      rank: '',
      removedImages: [],
      cost: '',
      scholarship: '',
      requirements: ''
    });
    setSelectedImages([]);
  };

  const removeImage = (index) => {
    if (newUniversity._id) {
      // In edit mode, mark for removal
      const imageToRemove = newUniversity.images[index];
      const updatedImages = [...newUniversity.images];
      updatedImages.splice(index, 1);
      
      setNewUniversity({
        ...newUniversity,
        images: updatedImages,
        removedImages: [...(newUniversity.removedImages || []), imageToRemove]
      });
    } else {
      // In create mode, just remove from array
      const updatedImages = [...newUniversity.images];
      updatedImages.splice(index, 1);
      setNewUniversity({
        ...newUniversity,
        images: updatedImages
      });
    }
    
    // Remove from preview
    const updatedPreviews = [...selectedImages];
    updatedPreviews.splice(index, 1);
    setSelectedImages(updatedPreviews);
  };

  const removeSelectedImage = (index) => {
    // Calculate the correct index based on existing vs new images
    const existingImageCount = newUniversity.images?.length || 0;
    
    if (index < existingImageCount) {
      // This is an existing image
      removeImage(index);
    } else {
      // This is a new image
      const newImageIndex = index - existingImageCount;
      const updatedNewImages = [...(newUniversity.newImages || [])];
      updatedNewImages.splice(newImageIndex, 1);
      
      setNewUniversity({
        ...newUniversity,
        newImages: updatedNewImages
      });
      
      // Remove from preview
      const updatedPreviews = [...selectedImages];
      updatedPreviews.splice(index, 1);
      setSelectedImages(updatedPreviews);
    }
  };

  return (
    <div className="mybookings-table-wrap mt-4">
      <div className='text-end mb-3'>
        <button className="add_blog_btn" onClick={() => setIsUniversity(true)}>
          Add University
        </button>
      </div>
      
      <Table borderless className="mybookings-table">
        <thead style={{ "--bg-color": "#f3f5ff" }}>
          <tr style={{ "--text-color": "#8d9eff" }}>
            <th>S.No</th>
            <th>University Name</th>
            <th>Location</th>
            <th>Country</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.length <= 0 ? (
            <tr className="text-center">
              <td colSpan={4}>
                <h6>No records available</h6>
              </td>
            </tr>
          ) : (
            list.map((item, idx) => (
              <tr key={item._id} className="cursor-pointer">
                <td>{tableOption.skip + idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.location}</td>
                <td>{item.country}</td>
                <td className="action-space">
                  <span className="text-warning" onClick={() => editUniversity(item)}>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </span>
                  <span className="action-btn" id={`deleteId-${idx}`} onClick={() => onDelete(item._id)}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
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
                        <b className="text-dark">{item.name}</b>?
                      </h6>
                      <div className="d-flex align-items-center">
                        <button 
                          type="button" 
                          className='confirm_btn' 
                          title="Yes" 
                          onClick={(e) => deleteSubject(e, item)}
                        >
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
            ))
          )}
        </tbody>
      </Table>
      
      <Pagination
        prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
        nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
        firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
        lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
        activePage={activePage}
        itemsCountPerPage={currPage}
        totalItemsCount={pages}
        pageRangeDisplayed={pageRangeDisplayed}
        onChange={paginate}
        itemClass="page-item"
        linkClass="page-link"
        activeLinkClass="subject"
      />
      
      <Modal isOpen={isUniversity} toggle={closeUniversity} centered size='lg'>
        <ModalHeader>{newUniversity?._id ? 'Edit' : 'Add'} University</ModalHeader>
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Country</label>
                <div>
                  <Select
                    styles={customStyles}
                    options={countryOptions}
                    value={countryOptions.filter(op => op.value === newUniversity?.country)}
                    onChange={(e) => setNewUniversity({
                      ...newUniversity,
                      country: e.value,
                      currency: currencyOption.find(cur => cur.value.country === e.value)?.value || {}
                    })}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="font-semi code-red">Currency</label>
                <div>
                  <Select
                    styles={customStyles}
                    options={currencyOption}
                    value={currencyOption.filter(op => op.value.country === newUniversity?.currency?.country)}
                    onChange={(e) => setNewUniversity({ ...newUniversity, currency: e.value })}
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
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className='d-flex flex-wrap'>
                  {selectedImages.map((img, index) => (
                    <div key={index} className='uni-edit-img position-relative m-2'>
                      <div 
                        className='uni-close-btn position-absolute' 
                        style={{ top: '5px', right: '5px', cursor: 'pointer' }}
                        onClick={() => removeSelectedImage(index)}
                      >
                        <img src={closeIcon} className='cross' alt="Remove" />
                      </div>
                      <img 
                        className='uni-img' 
                        src={img}
                        alt={`University ${index + 1}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* TinyMCE sections */}
              <div className="col-12 mt-3">
                <label className="font-semi code-red">About University</label>
                <div>
                  <Tinymce 
                    content={newUniversity.details} 
                    handleEditorChange={(content) => setNewUniversity({ ...newUniversity, details: content })}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <label className="font-semi code-red">Cost</label>
                <div>
                  <Tinymce 
                    content={newUniversity.cost} 
                    handleEditorChange={(content) => setNewUniversity({ ...newUniversity, cost: content })}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <label className="font-semi code-red">Scholarship</label>
                <div>
                  <Tinymce 
                    content={newUniversity.scholarship} 
                    handleEditorChange={(content) => setNewUniversity({ ...newUniversity, scholarship: content })}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <label className="font-semi code-red">Requirements</label>
                <div>
                  <Tinymce 
                    content={newUniversity.requirements} 
                    handleEditorChange={(content) => setNewUniversity({ ...newUniversity, requirements: content })}
                  />
                </div>
              </div>
              <div className='mt-4'>
                <button 
                  className='add_blog_btn' 
                  onClick={newUniversity._id ? onSubmitEditUni : onSubmitBlog}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default University;