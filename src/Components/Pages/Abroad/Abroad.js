import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import './abroad.css';
import { Table } from 'reactstrap';

function Abroad() {
  // Placeholder data for demonstration
  const [abroadList] = useState([
    {
      id: 'A001',
      title: 'Study in USA',
      postedOn: '2024-06-01',
      description: 'Opportunities for higher education in the USA.'
    },
    {
      id: 'A002',
      title: 'Study in Canada',
      postedOn: '2024-05-15',
      description: 'Explore Canadian universities and programs.'
    },
    {
      id: 'A003',
      title: 'Study in Australia',
      postedOn: '2024-04-20',
      description: 'Australian education and student life.'
    }
  ]);

  return (
    <Layout>
      <div className="abroad-header">
        <div className='text-end'>
          <button className="add_blog_btn" onClick={() => window.location.href='/abroad/add'}>Add Abroad Program</button>
        </div>
      </div>
      <div className="mybookings-table-wrap mt-4">
        <Table borderless className="mybookings-table">
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
            {abroadList.length === 0 ? (
              <tr className="text-center">
                <td colSpan={6}>
                  <h6>No records available</h6>
                </td>
              </tr>
            ) : (
              abroadList.map((item, idx) => (
                <tr key={item.id} className="cursor-pointer">
                  <td>{idx + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.postedOn}</td>
                  <td>{item.description}</td>
                  <td className="action-space">
                    <span className="text-primary" title="View">
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </span>
                    <span className="text-warning ms-2" title="Edit">
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </span>
                    <span className="action-btn ms-2" title="Delete">
                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
}

export default Abroad;
