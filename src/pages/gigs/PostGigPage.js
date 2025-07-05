import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import api from '../../services/api';

const initialState = {
  title: '',
  description: '',
  requiredSkills: '',
  requiredCertifications: '',
  duration: '',
  location: '',
  payRate: '',
};

const PostGigPage = ({ currentUser }) => {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.createGig(form);
      setSubmitted(true);
      setError(null);
      setForm(initialState);
    } catch (err) {
      setError('Failed to post gig. Please try again.');
      console.error(err);
    }
  };

  if (!currentUser || currentUser.role !== 'Lab') {
    return (
      <div className="container mt-4">
        <Alert color="danger">You must be logged in as a Lab to post a gig.</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Card>
        <CardBody>
          <CardTitle tag="h3">Post a New Gig / Project</CardTitle>
          {submitted && <Alert color="success">Gig submitted successfully!</Alert>}
          {error && <Alert color="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input name="title" id="title" value={form.title} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="textarea" name="description" id="description" value={form.description} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="requiredSkills">Required Skills (comma separated)</Label>
              <Input name="requiredSkills" id="requiredSkills" value={form.requiredSkills} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="requiredCertifications">Required Certifications (comma separated)</Label>
              <Input name="requiredCertifications" id="requiredCertifications" value={form.requiredCertifications} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="duration">Duration</Label>
              <Input name="duration" id="duration" value={form.duration} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="location">Location</Label>
              <Input name="location" id="location" value={form.location} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="payRate">Pay Rate</Label>
              <Input name="payRate" id="payRate" value={form.payRate} onChange={handleChange} />
            </FormGroup>
            <Button color="primary" type="submit">Submit</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(PostGigPage);
