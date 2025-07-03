import React from 'react';
import Widget from '../../../components/Widget';
import s from '../../products/Products.module.scss';

const publications = [
  {
    id: 'pub-001',
    img: require('../../../images/products/pub1.jpg'),
    title: 'Protein Purification in Oncology',
    journal: 'BioTech Journal',
    year: 2024,
    status: 'Published',
  },
  {
    id: 'pub-002',
    img: require('../../../images/products/pub2.jpg'),
    title: 'Cell Culture Scale-Up Methods',
    journal: 'Pharma Science',
    year: 2023,
    status: 'Published',
  },
  // Add more mock publications as needed
];

const Publications = () => (
  <div>
    <h2>Publications</h2>
    <p>List your scientific publications, articles, and research papers here.</p>
    <Widget title="My Publications" collapse close>
      <table className={`table table-striped ${s.bootstrapTable}`}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Journal</th>
            <th>Year</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {publications.map(item => (
            <tr key={item.id}>
              <td><img src={item.img} alt="..." style={{width: 40, borderRadius: 4}} /></td>
              <td>{item.title}</td>
              <td>{item.journal}</td>
              <td>{item.year}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  </div>
);

export default Publications;
