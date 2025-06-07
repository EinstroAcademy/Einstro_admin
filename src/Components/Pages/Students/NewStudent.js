import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import { Col, Row } from 'reactstrap'
import './newStudent.css'
import axios from 'axios'
import { countryList } from './options'
import Select from 'react-select'

function NewStudent() {
    const [countryOption,setCountryOption] = useState([])

    useEffect(()=>{
        setCountryOption(
            countryList.map((country)=>{
            return {label:country.name,value:country.name}
        })
        )
    },[])

    
  return (
    <Layout>
        <div className='container-fluid new-std-container'>
            <h4 className='new-std-head'>New Student Details</h4>
            <hr/>
            <div className='std-info'>
                <h6 className='new-std-info'>Information</h6>
                <Row className='mb-2'>
                    <Col lg='4'>
                        <label>First Name <span className='text-danger'>*</span></label>
                        <div>
                            <input type='text' className='std-input-control'/>
                        </div>
                        <span className='std-req'> As per your passport or ID proof</span>
                    </Col>
                    <Col lg='4'>
                        <label>Middle Name</label>
                        <div>
                            <input type='text' className='std-input-control'/>
                        </div>
                    </Col>
                    <Col lg='4'>
                        <label>Last Name </label>
                        <div>
                            <input type='text' className='std-input-control'/>
                        </div>
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col lg='4'>
                        <label>Date of Birth <span className='text-danger'>*</span></label>
                        <div>
                            <input type='date' className='std-input-control'/>
                        </div>
                    </Col>
                    <Col lg='4'>
                        <label>First Language <span className='text-danger'>*</span></label>
                        <div>
                            <input type='text' className='std-input-control'/>
                        </div>
                    </Col>
                    <Col lg='4'>
                        <label>Country of Citienship <span className='text-danger'>*</span></label>
                        <div>
                            <input type='text' className='std-input-control'/>
                        </div>
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col lg='4'>
                        <label>Marital Status<span className='text-danger'>*</span></label>
                        <div>
                            <input type='radio' className='me-1'/><label className='me-3'>Single</label>
                            <input type='radio' className='me-1'/><label className='me-3'>Married</label>
                        </div>
                    </Col>
                    <Col lg='4'>
                        <label>Gender<span className='text-danger'>*</span></label>
                        <div>
                            <input type='radio' className='me-1'/><label className='me-3'>Male</label>
                            <input type='radio' className='me-1'/><label className='me-3'>Female</label>
                        </div>
                    </Col>
                </Row>
                <hr/>
                <h6 className='new-std-info'>Passport info</h6>
                <Row className='mb-2'>
                        <Col lg='4'>
                        <label>Passport Number <span className='text-danger'>*</span></label>
                        <div>
                            <input type='text' className='std-input-control'/>
                        </div>
                    </Col> 
                    <Col lg='4'>
                        <label>Passport Expiry Date <span className='text-danger'>*</span></label>
                        <div>
                            <input type='date' className='std-input-control'/>
                        </div>
                    </Col> 
                </Row>
                <hr/>
                 <h6 className='new-std-info'>Address Details</h6>
                <Row className='mb-2'>
                    <Col lg='8'>
                        <label>Address <span className='text-danger'>*</span></label>
                        <div>
                            <input type='text' className='std-input-control'/>
                        </div>
                    </Col> 
                    <Col lg='4'>
                        <label>City/Town <span className='text-danger'>*</span></label>
                        <div>
                            <input type='text' className='std-input-control'/>
                        </div>
                    </Col> 
                </Row>
                <Row className='mb-2'>
                     <Col lg='4'>
                        <label>Country <span className='text-danger'>*</span></label>
                        <div>
                           <Select options={countryOption} isClearable/>
                        </div>
                    </Col> 
                    <Col lg='4'>
                        <label>State <span className='text-danger'>*</span></label>
                        <div>
                            <input type='text' className='std-input-control'/>
                        </div>
                    </Col>
                    <Col lg='4'>
                        <label>Postal/Zip code <span className='text-danger'>*</span></label>
                        <div>
                            <input type='text' className='std-input-control'/>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    </Layout>
  )
}

export default NewStudent