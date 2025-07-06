import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Badge, Row, Col } from 'reactstrap';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaTag, FaUser } from 'react-icons/fa';
import s from './OfferingDetail.module.scss';

const OfferingDetail = ({ data }) => {
  if (!data) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTags = (tags) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim());
  };

  return (
    <div className={s.offeringDetail}>
      {/* Header Section */}
      <div className={s.offeringHeader}>
        <Row>
          <Col md={8}>
            <h1 className={s.offeringTitle}>{data.title}</h1>
            {data.subtitle && <p className={s.offeringSubtitle}>{data.subtitle}</p>}
            <div className={s.offeringMeta}>
              <span className={s.metaItem}>
                <FaTag className={s.icon} />
                <Badge color="primary">{data.category}</Badge>
              </span>
              <span className={s.metaItem}>
                <Badge color="secondary">{data.offering_type}</Badge>
              </span>
              {data.location && (
                <span className={s.metaItem}>
                  <FaMapMarkerAlt className={s.icon} />
                  {data.location}
                </span>
              )}
              {data.duration && (
                <span className={s.metaItem}>
                  <FaClock className={s.icon} />
                  {data.duration}
                </span>
              )}
            </div>
          </Col>
          <Col md={4} className="text-right">
            <div className={s.priceSection}>
              <div className={s.price}>
                <FaDollarSign className={s.priceIcon} />
                <span className={s.priceAmount}>{formatPrice(data.price)}</span>
              </div>
              {data.pricing_model && (
                <div className={s.pricingModel}>
                  <small className="text-muted">{data.pricing_model} price</small>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>

      {/* Image Section */}
      {data.img && (
        <div className={s.offeringImage}>
          <img src={data.img} alt={data.title} className={s.image} />
        </div>
      )}

      {/* Description Section */}
      <Card className={s.descriptionCard}>
        <CardBody>
          <h3>Description</h3>
          <p className={s.description}>{data.description}</p>
        </CardBody>
      </Card>

      {/* Requirements Section */}
      {data.requirements && (
        <Card className={s.requirementsCard}>
          <CardBody>
            <h3>Requirements</h3>
            <p className={s.requirements}>{data.requirements}</p>
          </CardBody>
        </Card>
      )}

      {/* Deliverables Section */}
      {data.deliverables && (
        <Card className={s.deliverablesCard}>
          <CardBody>
            <h3>Deliverables</h3>
            <p className={s.deliverables}>{data.deliverables}</p>
          </CardBody>
        </Card>
      )}

      {/* Tags Section */}
      {data.tags && (
        <Card className={s.tagsCard}>
          <CardBody>
            <h3>Tags</h3>
            <div className={s.tagsList}>
              {formatTags(data.tags).map((tag, index) => (
                <Badge key={index} color="light" className={s.tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Contact Section */}
      <Card className={s.contactCard}>
        <CardBody>
          <h3>Contact Provider</h3>
          <div className={s.contactInfo}>
            <FaUser className={s.icon} />
            <span>Provider ID: {data.provider_id}</span>
          </div>
          <div className={s.contactActions}>
            <button className="btn btn-primary mr-2">
              Contact Provider
            </button>
            <button className="btn btn-outline-primary">
              Save to Favorites
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

OfferingDetail.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    img: PropTypes.string,
    offering_type: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.number,
    pricing_model: PropTypes.string,
    location: PropTypes.string,
    duration: PropTypes.string,
    requirements: PropTypes.string,
    deliverables: PropTypes.string,
    tags: PropTypes.string,
    provider_id: PropTypes.number,
  }),
};

export default OfferingDetail;
