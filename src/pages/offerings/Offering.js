import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Section from '../product/components/Section/Section';
import Banner from '../product/components/Banner/Banner';
import Description from '../product/components/Description/Description';
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
    };

    componentDidMount() {
        window.scrollTo(0,0);
        this.fetchOffering();
    }

    async fetchOffering() {
        try {
            const response = await api.getOffering(this.getId());
            this.setState({ offering: response.data });
        } catch (error) {
            console.error("Failed to fetch offering", error);
        }
    }

    getId() {
        const {match} = this.props;
        return parseInt(match.params.id);
    }

    render () {
        const { offering } = this.state;

        return (
            <div className="product-details">
                <h1 className="page-title">Provider - <span className="fw-semi-bold">Offering Detail</span></h1>
                {
                    offering && (
                        <div>
                            <Banner data={offering}/>
                            <Section title="Offering Description" h>
                                <Description data={offering}/>
                            </Section>
                        </div>
                    )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        offering: state.offerings.data,
    };
}

export default withRouter(connect(mapStateToProps)(Offering));