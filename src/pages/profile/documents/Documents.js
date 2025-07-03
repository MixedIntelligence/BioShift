import React from 'react';
import Widget from '../../../components/Widget';
import s from '../../products/Products.module.scss';

const documents = [
  {
    id: 'doc-001',
    img: require('../../../images/products/doc1.jpg'),
    name: 'GLP Certification',
    type: 'Certification',
    issued: '2023-05-01',
    status: 'Active',
  },
  {
    id: 'doc-002',
    img: require('../../../images/products/doc2.jpg'),
    name: 'Biosafety Level 2',
    type: 'Certification',
    issued: '2022-11-15',
    status: 'Active',
  },
  // Add more mock documents as needed
];

const Documents = () => (
  <div>
    <h2>Documents</h2>
    <p>Upload, view, and manage your important documents and credentials here.</p>
    <Widget title="My Documents" collapse close>
      <table className={`table table-striped ${s.bootstrapTable}`}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Type</th>
            <th>Issued</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(item => (
            <tr key={item.id}>
              <td><img src={item.img} alt="..." style={{width: 40, borderRadius: 4}} /></td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.issued}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  </div>
);

export default Documents;
