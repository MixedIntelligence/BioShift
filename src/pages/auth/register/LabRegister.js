import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Alert, Button } from 'reactstrap';
import Widget from '../../../components/Widget';
import { authError, registerUser } from '../../../actions/auth';

class LabRegister extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: ''
        };

        this.doRegister = this.doRegister.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changeConfirmPassword = this.changeConfirmPassword.bind(this);
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
            this.props.dispatch(registerUser({
                email: this.state.email,
                password: this.state.password,
                role: 'Lab'
            }));
        }
    }

    render() {
        return (
            <div className="auth-page">
                <Container>
                    <h5 className="auth-logo">
                        <i className="la la-circle text-gray"/>
                        LabLeap
                        <i className="la la-circle text-warning"/>
                    </h5>
                    <Widget className="widget-auth mx-auto" title={<h3 className="mt-0">Create a Lab Account</h3>}>
                        <p className="widget-auth-info">
                            Please fill all fields below
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
                                <input className="form-control no-border" value={this.state.email}
                                       onChange={this.changeEmail} type="text" required name="email"
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
                                       placeholder="Confirm"/>
                            </div>
                            <Button type="submit" color="inverse" className="auth-btn mb-3" size="sm">{this.props.isFetching ? 'Loading...' : 'Register'}</Button>
                        </form>
                        <p className="widget-auth-info">
                            Already have an account?
                        </p>
                        <Link className="d-block text-center" to="/login">Enter the account</Link>
                    </Widget>
                </Container>
                <footer className="auth-footer">
                    {new Date().getFullYear()} &copy; LabLeap
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

export default withRouter(connect(mapStateToProps)(LabRegister));