import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import OfferingDetail from './components/OfferingDetail';
import api from '../../services/api';

class Offering extends React.Component {
    static propTypes = {
        offering: PropTypes.object,
        dispatch: PropTypes.func.isRequired,
    };

    static defaultProps = {
        offering: {}
    };

    state = {
        offering: null,
        loading: true,
        error: null,
    };

    componentDidMount() {
        window.scrollTo(0,0);
        this.fetchOffering();
    }

    async fetchOffering() {
        try {
            this.setState({ loading: true, error: null });
            const response = await api.getOffering(this.getId());
            this.setState({ offering: response.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch offering", error);
            this.setState({ 
                error: error.response?.data?.error || error.message || 'Failed to fetch offering',
                loading: false 
            });
        }
    }

    getId() {
        const {match} = this.props;
        return parseInt(match.params.id);
    }

    render () {
        const { offering, loading, error } = this.state;

        if (loading) {
            return (
                <div className="product-details">
                    <h1 className="page-title">Provider - <span className="fw-semi-bold">Offering Detail</span></h1>
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p>Loading offering details...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="product-details">
                    <h1 className="page-title">Provider - <span className="fw-semi-bold">Offering Detail</span></h1>
                    <div className="alert alert-danger">
                        <h4>Error Loading Offering</h4>
                        <p>{error}</p>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => this.fetchOffering()}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="offering-page">
                <div className="container">
                    <h1 className="page-title mb-4">
                        Offering - <span className="fw-semi-bold">Details</span>
                    </h1>
                    {offering ? (
                        <OfferingDetail data={offering} />
                    ) : (
                        <div className="alert alert-warning">
                            Offering not found.
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // Component uses local state, so no Redux state needed
    };
}

export default withRouter(connect(mapStateToProps)(Offering));