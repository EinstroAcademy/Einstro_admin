import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Users,
  BookOpen,
  University,
  FileText,
} from 'lucide-react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import './dashboard.css';
import Layout from '../Layout/Layout';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const statCards = [
  { icon: <BookOpen size={28} />, label: 'Courses', value: 112 },
  { icon: <University size={28} />, label: 'Universities', value: 24 },
  { icon: <Users size={28} />, label: 'Users', value: 728 },
  { icon: <FileText size={28} />, label: 'Applications', value: 1432 },
];

// Mock chart and table data
const doughnutData = {
  labels: ['Accepted', 'Pending', 'Rejected'],
  datasets: [
    {
      data: [650, 540, 242],
      backgroundColor: [
        'rgba(0, 200, 134, 0.7)',
        'rgba(255, 205, 86, 0.7)',
        'rgba(240, 63, 66, 0.7)'
      ],
      borderWidth: 1,
    },
  ],
};

const barData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'User Activity',
      data: [105, 200, 170, 120, 260, 300, 250],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderRadius: 8,
    },
  ],
};

const recentApplications = [
  { id: 1001, user: 'Balaji T', course: 'Data Science', status: 'Accepted', date: '2024-05-24' },
  { id: 1002, user: 'Heena P', course: 'MBA', status: 'Pending', date: '2024-05-22' },
  { id: 1003, user: 'Raj Sharma', course: 'Computer Science', status: 'Rejected', date: '2024-05-20' },
  { id: 1004, user: 'Lina S', course: 'Marketing', status: 'Pending', date: '2024-05-19' },
  { id: 1005, user: 'Yusuf U', course: 'Cybersecurity', status: 'Accepted', date: '2024-05-17' },
];


export default function Dashboard() {
  return (
    <Layout>
      <div className="dashboard-container">
        <h1 className="dash-title">Dashboard</h1>
        <div className="dashboard-stats">
          {statCards.map((card, i) => (
            <div key={i} className="dashboard-stat-card">
              <div className="dash-stat-icon">{card.icon}</div>
              <div className="dash-stat-info">
                <div className="dash-stat-value">{card.value}</div>
                <div className="dash-stat-label">{card.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard-charts">
          <div className="dashboard-chart dashboard-chart-row">
            <h3>User Application Submission</h3>
            <div className="doughnut-row-wrap">
              <div className="doughnut-left">
                <Doughnut data={doughnutData} options={{
                  responsive: true,
                  plugins: { legend: { display: false } }
                }} />
              </div>
              <div className="doughnut-values">
                {doughnutData.labels.map((label, idx) => (
                  <div className="doughnut-value-row" key={label}>
                    <span className="doughnut-bullet" style={{background:doughnutData.datasets[0].backgroundColor[idx]}}></span>
                    <span className="doughnut-label">{label}</span>
                    <span className="doughnut-value">{doughnutData.datasets[0].data[idx]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="dashboard-chart dashboard-bar-tall">
            <h3>User Activity</h3>
            <Bar data={barData} options={{
              responsive: true,
              plugins: { legend: { display: false }, title: { display: false } },
              scales: { y: { beginAtZero: true } }
            }}/>
          </div>
        </div>
        <div className="dashboard-table-section">
          <h3>Recent User Applications</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Course</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map(app => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.user}</td>
                  <td>{app.course}</td>
                  <td>
                    <span
                      className={`dash-status dash-status-${app.status.toLowerCase()}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>{app.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
