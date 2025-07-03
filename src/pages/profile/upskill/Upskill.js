import React from 'react';
import s from '../../products/Products.module.scss';
import ProductCard from '../../products/components/ProductCard/ProductCard';

// Mock upskilling courses (replace with real data or connect to store as needed)
const upskillCourses = [
  {
    id: 'course-001',
    img: require('../../../images/products/upskill1.jpg'),
    title: 'Advanced Protein Purification',
    subtitle: 'Masterclass by Dr. Elena Vance',
    price: 199,
    rating: 4.8,
    description: 'Deep dive into advanced protein purification techniques for biotech and pharma.',
    favourite: false,
  },
  {
    id: 'course-002',
    img: require('../../../images/products/upskill2.jpg'),
    title: 'Cell Culture Scale-Up Bootcamp',
    subtitle: 'With Samir Patel',
    price: 149,
    rating: 4.7,
    description: 'Hands-on bootcamp for scaling up mammalian cell cultures in R&D.',
    favourite: true,
  },
  // Add more mock courses as needed
];

const Upskill = () => (
  <div>
    <h2>Upskill & Learning</h2>
    <p>Browse and enroll in professional development courses to boost your lab skills.</p>
    <div className={s.productsListElements}>
      {upskillCourses.map(item => <ProductCard key={item.id} {...item} />)}
    </div>
  </div>
);

export default Upskill;
