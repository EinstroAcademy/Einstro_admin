import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import { Nav, NavItem,NavLink, TabContent, TabPane } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './myaccount.css'
import MyProfile from './MyProfile';
import MyPassword from './MyPassword';

function MyAccount() {
    const admin= useSelector((state) => state.admin.admin);
  const [activeTab, setActiveTab] = useState('1');

  const navigate = useNavigate();

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    if (admin.role !== 'admin') {
      return navigate(-1);
    }
  }, []);

  return (
    <Layout>
        <>
        <Nav id="profileTabs" tabs>
        <NavItem>
          <NavLink
            className={`${activeTab === '1' ? 'active' : ''}`}
            onClick={() => {
              toggle('1');
            }}
          >
            My Profile
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={`${activeTab === '2' ? 'active' : ''}`}
            onClick={() => {
              toggle('2');
            }}
          >
            Password
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
            <MyProfile/>
        </TabPane>
        <TabPane tabId="2">
            <MyPassword/>
        </TabPane>
      </TabContent>
        </>
    </Layout>
  )
}

export default MyAccount