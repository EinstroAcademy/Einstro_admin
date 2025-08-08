import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import './abroad.css';
import { useNavigate } from 'react-router-dom';

const initialData = {
  part1: {
    title: '',
    subtitle: '',
    services: ['', '', '', ''],
    cta: { text: '', url: '' },
    images: { description: '', url: '' },
    designElements: [
      { shape: 'hexagon', color: '#D92027' },
      { shape: 'hexagon', color: '#D92027' },
      { shape: 'hexagon', color: '#D92027' }
    ]
  },
  part2: {
    imagePlace: '',
    title: '',
    introduction: '',
    benefits: [
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' }
    ],
    images: { description: '', url: '' }
  },
  universities: [
    { name: '', image: '' },
    { name: '', image: '' },
    { name: '', image: '' },
    { name: '', image: '' },
    { name: '', image: '' },
    { name: '', image: '' },
    { name: '', image: '' },
    { name: '', image: '' }
  ],
  courses: {
    title: '',
    categories: [
      { category: '', courses: Array(10).fill('') },
      { category: '', courses: Array(10).fill('') },
      { category: '', courses: Array(10).fill('') }
    ]
  },
  sub_nav: true,
  reqImage: '',
  admission_requirements: {
    course: [
      { name: '', details: '' },
      { name: '', details: '' },
      { name: '', details: '' }
    ],
    exams_required: {}
  },
  intake: [
    { name: '', details: ['', '', '', ''] },
    { name: '', details: ['', '', '', ''] },
    { name: '', details: ['', '', '', ''] }
  ],
  cost: {
    description: '',
    table_headings: ['', ''],
    cost_per_year: [
      { degree: '', costInGBP: '' },
      { degree: '', costInGBP: '' },
      { degree: '', costInGBP: '' }
    ]
  },
  visa_requirements: {
    description: '',
    list: []
  },
  scholarship: {
    content: ''
  },
  post_study: {
    description: '',
    jobs: [
      { jobTitle: '', averageAnnualSalaryGBP: '' },
      { jobTitle: '', averageAnnualSalaryGBP: '' },
      { jobTitle: '', averageAnnualSalaryGBP: '' },
      { jobTitle: '', averageAnnualSalaryGBP: '' },
      { jobTitle: '', averageAnnualSalaryGBP: '' },
      { jobTitle: '', averageAnnualSalaryGBP: '' },
      { jobTitle: '', averageAnnualSalaryGBP: '' },
      { jobTitle: '', averageAnnualSalaryGBP: '' },
      { jobTitle: '', averageAnnualSalaryGBP: '' },
      { jobTitle: '', averageAnnualSalaryGBP: '' }
    ]
  }
};

function AddAbroad() {
  const [form, setForm] = useState(initialData);
  const navigate = useNavigate();

  // Example: handle change for part1.title
  const handleChange = (section, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Example: handle change for nested fields (like cta, images, etc.)
  const handleNestedChange = (section, nested, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nested]: {
          ...prev[section][nested],
          [field]: value
        }
      }
    }));
  };

  // Example: handle array change (like services, benefits, etc.)
  const handleArrayChange = (section, arrayField, idx, value, nestedField) => {
    setForm(prev => {
      const arr = [...prev[section][arrayField]];
      if (nestedField) {
        arr[idx][nestedField] = value;
      } else {
        arr[idx] = value;
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayField]: arr
        }
      };
    });
  };

  // Example: handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert('Form submitted! Check console for data.');
    console.log(form);
  };

  return (
    <Layout>
      <div className="add-abroad-form-container">
        <button className="btn btn-link" onClick={() => navigate(-1)}>&larr; Back</button>
        <h2>Add Abroad Program</h2>
        <form onSubmit={handleSubmit} className="add-abroad-form">
          <fieldset>
            <legend>Part 1</legend>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Title
                  <input type="text" className="form-control" value={form.part1.title} onChange={e => handleChange('part1', 'title', e.target.value)} />
                </label>
              </div>
              <div className="col-md-6 mb-3">
                <label>Subtitle
                  <input type="text" className="form-control" value={form.part1.subtitle} onChange={e => handleChange('part1', 'subtitle', e.target.value)} />
                </label>
              </div>
              <div className="col-md-6 mb-3">
                <label>CTA Text
                  <input type="text" className="form-control" value={form.part1.cta.text} onChange={e => handleNestedChange('part1', 'cta', 'text', e.target.value)} />
                </label>
              </div>
              <div className="col-md-6 mb-3">
                <label>CTA URL
                  <input type="text" className="form-control" value={form.part1.cta.url} onChange={e => handleNestedChange('part1', 'cta', 'url', e.target.value)} />
                </label>
              </div>
              <div className="col-md-6 mb-3">
                <label>Image Description
                  <input type="text" className="form-control" value={form.part1.images.description} onChange={e => handleNestedChange('part1', 'images', 'description', e.target.value)} />
                </label>
              </div>
              <div className="col-md-6 mb-3">
                <label>Image URL
                  <input type="text" className="form-control" value={form.part1.images.url} onChange={e => handleNestedChange('part1', 'images', 'url', e.target.value)} />
                </label>
              </div>
              <div className="col-12 mb-3">
                <label>Services</label>
                <div className="row">
                  {form.part1.services.map((service, idx) => (
                    <div className="col-md-6 mb-2" key={idx}>
                      <input type="text" className="form-control" value={service} onChange={e => handleArrayChange('part1', 'services', idx, e.target.value)} placeholder={`Service ${idx+1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Part 2</legend>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Image Place
                  <input type="text" className="form-control" value={form.part2.imagePlace} onChange={e => handleChange('part2', 'imagePlace', e.target.value)} />
                </label>
              </div>
              <div className="col-md-6 mb-3">
                <label>Title
                  <input type="text" className="form-control" value={form.part2.title} onChange={e => handleChange('part2', 'title', e.target.value)} />
                </label>
              </div>
              <div className="col-12 mb-3">
                <label>Introduction
                  <textarea className="form-control" value={form.part2.introduction} onChange={e => handleChange('part2', 'introduction', e.target.value)} />
                </label>
              </div>
              <div className="col-12 mb-3">
                <label>Benefits</label>
                <div className="row">
                  {form.part2.benefits.map((b, idx) => (
                    <div className="col-md-6 mb-2" key={idx}>
                      <input type="text" className="form-control" value={b.text} onChange={e => handleArrayChange('part2', 'benefits', idx, e.target.value, 'text')} placeholder={`Benefit ${idx+1}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label>Image Description
                  <input type="text" className="form-control" value={form.part2.images.description} onChange={e => handleNestedChange('part2', 'images', 'description', e.target.value)} />
                </label>
              </div>
              <div className="col-md-6 mb-3">
                <label>Image URL
                  <input type="text" className="form-control" value={form.part2.images.url} onChange={e => handleNestedChange('part2', 'images', 'url', e.target.value)} />
                </label>
              </div>
            </div>
          </fieldset>
          {/* Additional sections for universities, courses, requirements, etc. can be added similarly */}
          <button type="submit" className="btn btn-primary mt-3">Submit</button>
        </form>
      </div>
    </Layout>
  );
}

export default AddAbroad;
