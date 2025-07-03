import React from 'react';
import Widget from '../../../components/Widget';
import s from '../../products/Products.module.scss';

const patents = [
  {
    id: 'pat-001',
    img: require('../../../images/products/patent1.jpg'),
    title: 'Automated Protein Purification Device',
    number: 'US1234567B2',
    year: 2024,
    status: 'Granted',
  },
  {
    id: 'pat-002',
    img: require('../../../images/products/patent2.jpg'),
    title: 'Bioreactor Monitoring System',
    number: 'US2345678C1',
    year: 2023,
    status: 'Pending',
  },
  // Add more mock patents as needed
];

const Patents = () => (
  <div>
    <h2>Patents</h2>
    <p>List your patents, patent applications, and intellectual property here.</p>
    <Widget title="My Patents" collapse close>
      <table className={`table table-striped ${s.bootstrapTable}`}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Number</th>
            <th>Year</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {patents.map(item => (
            <tr key={item.id}>
              <td><img src={item.img} alt="..." style={{width: 40, borderRadius: 4}} /></td>
              <td>{item.title}</td>
              <td>{item.number}</td>
              <td>{item.year}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  </div>
);

export default Patents;
