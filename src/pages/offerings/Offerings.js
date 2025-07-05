import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import ProductCard from '../products/components/ProductCard/ProductCard';
import api from '../../services/api';
import s from '../products/Products.module.scss';

class Offerings extends Component {
  static propTypes = {
    offerings: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    offerings: []
  };

  state = {
    offerings: [],
  };

  componentDidMount() {
    this.fetchOfferings();
  }

  async fetchOfferings() {
    try {
      const response = await api.getMyOfferings();
      this.setState({ offerings: response.data });
    } catch (error) {
      console.error("Failed to fetch offerings", error);
    }
  }

  render() {
    const { offerings } = this.state;
    const proSubscriptionUrl = "https://buy.stripe.com/test_5kQ5kCgKo37QdyibQc1sQ01";
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="page-title">Provider - <span className="fw-semi-bold">Offerings</span></h1>
          <a href={proSubscriptionUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Subscribe to LabLeap Pro
          </a>
        </div>
        <div className={s.productsListElements}>
          {offerings.map(item => <ProductCard key={item.id} {...item} />)}
        </div>
      </div >
    );
  }
}

function mapStateToProps(state) {
    return {
        offerings: state.offerings.data,
    };
}

export default withRouter(connect(mapStateToProps)(Offerings));