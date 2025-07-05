import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import Widget from '../../components/Widget';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../../actions/applications';
import { connect } from 'react-redux';

const ProviderDashboard = (props) => {
    const [modal, setModal] = useState(false);
    const [isCreating, setIsCreating] = useState(true);
    const [currentApp, setCurrentApp] = useState(null);

    useEffect(() => {
        props.dispatch(getApplications());
    }, []);

    const toggle = (creating = true, app = null) => {
        setIsCreating(creating);
        setCurrentApp(app);
        setModal(!modal);
    }

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const appData = {
            name: formData.get('name'),
            description: formData.get('description'),
            redirect_uri: formData.get('redirect_uri'),
        };

        if (isCreating) {
            props.dispatch(createApplication(appData));
        } else {
            props.dispatch(updateApplication(currentApp.id, appData));
        }
        toggle();
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this application?")) {
            props.dispatch(deleteApplication(id));
        }
    }

    const { applications } = props;

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className="page-title">Provider Dashboard</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Widget>
                        <div className="d-flex justify-content-between">
                            <h3>Your Applications</h3>
                            <Button color="primary" onClick={() => toggle(true, null)}>Create New Application</Button>
                        </div>
                        <hr />
                        <Row>
                            {applications && applications.map(app => (
                                <Col md="4" key={app.id}>
                                    <Card className="mb-4">
                                        <CardBody>
                                            <CardTitle><h5>{app.name}</h5></CardTitle>
                                            <CardText>{app.description}</CardText>
                                            <p><strong>API Key:</strong> <code>{app.api_key}</code></p>
                                            <p><strong>Client Secret:</strong> <code>{app.client_secret}</code></p>
                                            <p><strong>Redirect URI:</strong> <code>{app.redirect_uri}</code></p>
                                            <Button color="secondary" size="sm" onClick={() => toggle(false, app)}>Edit</Button>
                                            {' '}
                                            <Button color="danger" size="sm" onClick={() => handleDelete(app.id)}>Delete</Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Widget>
                </Col>
            </Row>

            <Modal isOpen={modal} toggle={() => toggle()}>
                <ModalHeader toggle={() => toggle()}>{isCreating ? 'Create Application' : 'Edit Application'}</ModalHeader>
                <Form onSubmit={handleSave}>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Application Name</Label>
                            <Input type="text" name="name" id="name" defaultValue={currentApp ? currentApp.name : ''} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input type="textarea" name="description" id="description" defaultValue={currentApp ? currentApp.description : ''} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="redirect_uri">Redirect URI</Label>
                            <Input type="text" name="redirect_uri" id="redirect_uri" defaultValue={currentApp ? currentApp.redirect_uri : ''} required />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary">Save</Button>{' '}
                        <Button color="secondary" onClick={() => toggle()}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </Container>
    );
}

const mapStateToProps = (state) => ({
    applications: state.applications.applications,
});

export default connect(mapStateToProps)(ProviderDashboard);