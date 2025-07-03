import React from 'react';
import Widget from '../../../components/Widget';
import s from '../../products/Products.module.scss';

const startupProjects = [
  {
    id: 'startup-001',
    img: require('../../../images/products/startup1.jpg'),
    name: 'BioCore Analytics',
    description: 'AI-powered analytics for lab data. Co-founded by Elena Vance and team.',
    role: 'Co-Founder',
    year: 2023,
  },
  {
    id: 'startup-002',
    img: require('../../../images/products/startup2.jpg'),
    name: 'LabLeap Connect',
    description: 'A networking platform for lab professionals and startups.',
    role: 'Advisor',
    year: 2024,
  },
  // Add more mock startups as needed
];

const Startups = () => (
  <div>
    <h2>Startups</h2>
    <p>Showcase your startup projects, collaborations, and entrepreneurial activities here.</p>
    <Widget title="Startup Projects" collapse close>
      <div className={s.productsListElements}>
        {startupProjects.map(item => (
          <div key={item.id} className={s.productCard} style={{width: 300, display: 'inline-block', margin: 12}}>
            <div className={s.productCardPhoto} style={{ backgroundImage: `url(${item.img})`, height: 140, borderRadius: 8 }} />
            <div className={s.productCardDataWrapper}>
              <div className={s.productsCardTitle}>{item.name}</div>
              <div className={s.productsCardSubtitle}>{item.role} &bull; {item.year}</div>
              <div className={s.productsCardDescription}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  </div>
);

export default Startups;
