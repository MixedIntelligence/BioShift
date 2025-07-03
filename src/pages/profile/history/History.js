import React from 'react';
import Widget from '../../../components/Widget';
import s from '../../management/Management.module.scss';

// Mock history data (replace with real user activity data as needed)
const historyData = [
  {
    id: 'hist-001',
    img: require('../../../images/products/upskill1.jpg'),
    title: 'Applied: Protein Purification Gig',
    subtitle: 'Application submitted',
    date: '2025-06-15',
    status: 'Submitted',
  },
  {
    id: 'hist-002',
    img: require('../../../images/products/upskill2.jpg'),
    title: 'Completed: Cell Culture Bootcamp',
    subtitle: 'Course completed',
    date: '2025-05-30',
    status: 'Completed',
  },
  // Add more mock history items as needed
];

const History = () => (
  <div>
    <h2>History</h2>
    <p>Review your activity history, including gig applications, awards, and completed upskilling courses.</p>
    <Widget title="Activity History" collapse close>
      <table className={`table table-striped ${s.bootstrapTable}`}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Subtitle</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map(item => (
            <tr key={item.id}>
              <td><img src={item.img} alt="..." style={{width: 40, borderRadius: 4}} /></td>
              <td>{item.title}</td>
              <td>{item.subtitle}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  </div>
);

export default History;
