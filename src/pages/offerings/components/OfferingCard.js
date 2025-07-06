import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Badge, Button, Row, Col } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

const OfferingCard = ({ offering, isProvider = false, onEdit, onDelete }) => {
  const history = useHistory();

  const handleViewDetails = () => {
    history.push(`/app/offerings/${offering.id}`);
  };

  const getOfferingTypeColor = (type) => {
    switch (type) {
      case 'SERVICE': return 'primary';
      case 'EQUIPMENT': return 'success';
      case 'SOFTWARE': return 'info';
      case 'COURSE': return 'warning';
      default: return 'secondary';
    }
  };

  const getPricingModelText = (model, price) => {
    switch (model) {
      case 'FREE': return 'Free';
      case 'FIXED': return price ? `$${price}` : 'Price on request';
      case 'SUBSCRIPTION': return price ? `$${price}/month` : 'Subscription';
      case 'PER_USE': return price ? `$${price}/use` : 'Pay per use';
      default: return 'Contact for pricing';
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      <CardBody className="d-flex flex-column">
        <div className="mb-2">
          <Badge 
            color={getOfferingTypeColor(offering.offering_type)} 
            className="mb-2"
          >
            {offering.offering_type}
          </Badge>
          {offering.category && (
            <Badge color="light" className="ms-2 mb-2">
              {offering.category}
            </Badge>
          )}
        </div>
        
        <CardTitle tag="h5" className="mb-2">{offering.title}</CardTitle>
        
        {offering.subtitle && (
          <CardSubtitle className="mb-2 text-muted">{offering.subtitle}</CardSubtitle>
        )}
        
        <CardText className="flex-grow-1">
          {offering.description ? 
            (offering.description.length > 150 ? 
              `${offering.description.substring(0, 150)}...` : 
              offering.description
            ) : 
            'No description available'
          }
        </CardText>

        <div className="mb-3">
          <Row className="align-items-center">
            <Col>
              <strong className="text-primary">
                {getPricingModelText(offering.pricing_model, offering.price)}
              </strong>
            </Col>
            {offering.rating && (
              <Col xs="auto">
                <div className="text-warning">
                  {'★'.repeat(Math.floor(offering.rating))} 
                  <span className="text-muted ms-1">({offering.rating})</span>
                </div>
              </Col>
            )}
          </Row>
        </div>

        <div className="mt-auto">
          <Row>
            <Col>
              <Button 
                color="outline-primary" 
                size="sm" 
                onClick={handleViewDetails}
                className="w-100"
              >
                View Details
              </Button>
            </Col>
            {isProvider && (
              <>
                <Col>
                  <Button 
                    color="outline-secondary" 
                    size="sm" 
                    onClick={() => onEdit(offering)}
                    className="w-100"
                  >
                    Edit
                  </Button>
                </Col>
                <Col>
                  <Button 
                    color="outline-danger" 
                    size="sm" 
                    onClick={() => onDelete(offering.id)}
                    className="w-100"
                  >
                    Delete
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};

OfferingCard.propTypes = {
  offering: PropTypes.object.isRequired,
  isProvider: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default OfferingCard;
