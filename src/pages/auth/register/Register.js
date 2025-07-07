import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Alert, Button } from 'reactstrap';
import Widget from '../../../components/Widget';
import { authError, registerUser } from '../../../actions/auth';
import microsoft from '../../../images/microsoft.png';

class Register extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            role: 'Worker', // Default role
            companyName: '',
            website: ''
        };

        this.doRegister = this.doRegister.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
        this.microsoftLogin = this.microsoftLogin.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changeConfirmPassword = this.changeConfirmPassword.bind(this);
        this.changeRole = this.changeRole.bind(this);
        this.changeCompanyName = this.changeCompanyName.bind(this);
        this.changeWebsite = this.changeWebsite.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.isPasswordValid = this.isPasswordValid.bind(this);
    }

    changeEmail(event) {
        this.setState({email: event.target.value});
    }

    changePassword(event) {
        this.setState({password: event.target.value});
    }

    changeConfirmPassword(event) {
        this.setState({confirmPassword: event.target.value});
    }

    changeRole(event) {
        this.setState({role: event.target.value});
    }

    changeCompanyName(event) {
        this.setState({companyName: event.target.value});
    }

    changeWebsite(event) {
        this.setState({website: event.target.value});
    }

    checkPassword() {
        if (!this.isPasswordValid()) {
            if (!this.state.password) {
                this.props.dispatch(authError("Password field is empty"));
            } else {
                this.props.dispatch(authError("Passwords are not equal"));
            }
            setTimeout(() => {
                this.props.dispatch(authError());
            }, 3 * 1000)
        }
    }

    isPasswordValid() {
       return this.state.password && this.state.password === this.state.confirmPassword;
    }

    doRegister(e) {
        e.preventDefault();
        if (!this.isPasswordValid()) {
            this.checkPassword();
        } else {
            const registrationData = {
                email: this.state.email,
                password: this.state.password,
                role: this.state.role,
            };

            // Add provider-specific fields if role is Provider
            if (this.state.role === 'Provider') {
                if (!this.state.companyName || !this.state.website) {
                    this.props.dispatch(authError("Company name and website are required for Provider accounts"));
                    setTimeout(() => {
                        this.props.dispatch(authError());
                    }, 3 * 1000);
                    return;
                }
                registrationData.companyName = this.state.companyName;
                registrationData.website = this.state.website;
            }

            this.props.dispatch(registerUser(registrationData));
        }
    }

    googleLogin() {
        // a real google login implementation would go here
    }

    microsoftLogin() {
        // a real microsoft login implementation would go here
    }

    render() {
        console.log('Rendering Register component');
        return (
            <div className="auth-page">
                <Container>
                    <h5 className="auth-logo">
                        <i className="fa fa-circle text-primary" />
                        LabLeap
                        <i className="fa fa-circle text-danger" />
                    </h5>
                    <Widget className="widget-auth mx-auto" title={<h3 className="mt-0">Create your LabLeap account</h3>}>
                        <p className="widget-auth-info">
                            Join the biotech workforce revolution
                        </p>
                        <form className="mt" onSubmit={this.doRegister}>
                            {
                                this.props.errorMessage && (
                                    <Alert className="alert-sm" color="danger">
                                        {this.props.errorMessage}
                                    </Alert>
                                )
                            }
                            <div className="form-group">
                                <label htmlFor="role" className="form-label">Account Type</label>
                                <select 
                                    className="form-control no-border" 
                                    value={this.state.role}
                                    onChange={this.changeRole} 
                                    name="role"
                                    required
                                >
                                    <option value="Worker">Scientist/Worker - Looking for opportunities</option>
                                    <option value="Lab">Lab - Posting opportunities</option>
                                    <option value="Provider">Provider - Offering services/products</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input className="form-control no-border" value={this.state.email}
                                       onChange={this.changeEmail} type="email" required name="email"
                                       placeholder="Email"/>
                            </div>
                            <div className="form-group">
                                <input className="form-control no-border" value={this.state.password}
                                       onChange={this.changePassword} type="password" required name="password"
                                       placeholder="Password"/>
                            </div>
                            <div className="form-group">
                                <input className="form-control no-border" value={this.state.confirmPassword}
                                       onChange={this.changeConfirmPassword} onBlur={this.checkPassword} type="password" required name="confirmPassword"
                                       placeholder="Confirm Password"/>
                            </div>
                            {this.state.role === 'Provider' && (
                                <>
                                    <div className="form-group">
                                        <input className="form-control no-border" value={this.state.companyName}
                                               onChange={this.changeCompanyName} type="text" required name="companyName"
                                               placeholder="Company Name"/>
                                    </div>
                                    <div className="form-group">
                                        <input className="form-control no-border" value={this.state.website}
                                               onChange={this.changeWebsite} type="url" required name="website"
                                               placeholder="Company Website (https://...)"/>
                                    </div>
                                </>
                            )}
                            <Button type="submit" color="primary" className="auth-btn mb-3" size="sm">
                                {this.props.isFetching ? 'Creating Account...' : 'Create Account'}
                            </Button>
                            <p className="widget-auth-info">or sign up with</p>
                            <div className="social-buttons">
                                <Button onClick={this.googleLogin} color="primary" className="social-button mb-2">
                                    <i className="social-icon social-google"/>
                                    <p className="social-text">GOOGLE</p>
                                </Button>
                                <Button onClick={this.microsoftLogin} color="success" className="social-button">
                                    <i className="social-icon social-microsoft"
                                       style={{backgroundImage: `url(${microsoft})`}}/>
                                    <p className="social-text">MICROSOFT</p>
                                </Button>
                            </div>
                        </form>
                        <p className="widget-auth-info">
                            Already have the account? Login now!
                        </p>
                        <Link className="d-block text-center" to="login">Enter the account</Link>
                    </Widget>
                </Container>
                <footer className="auth-footer">
                    {new Date().getFullYear()} &copy; BioShift, Inc. - LabLeap
                </footer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isFetching: state.auth.isFetching,
        errorMessage: state.auth.errorMessage,
    };
}

export default withRouter(connect(mapStateToProps)(Register));

