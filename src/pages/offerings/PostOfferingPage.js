import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import api from '../../services/api';

const initialState = {
  title: '',
  subtitle: '',
  description: '',
  img: '',
  offering_type: 'SERVICE',
  category: '',
  pricing_model: 'FIXED',
  price: '',
  rating: '',
  url: '',
};

const PostOfferingPage = ({ currentUser }) => {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.createOffering(form);
      setSubmitted(true);
      setError(null);
      setForm(initialState);
    } catch (err) {
      setError('Failed to post offering. Please try again.');
      console.error(err);
    }
  };

  if (!currentUser || currentUser.role !== 'Provider') {
    return (
      <div className="container mt-4">
        <Alert color="danger">You must be logged in as a Provider to post an offering.</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Card>
        <CardBody>
          <CardTitle tag="h3">Post a New Offering</CardTitle>
          {submitted && <Alert color="success">Offering submitted successfully!</Alert>}
          {error && <Alert color="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input name="title" id="title" value={form.title} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="subtitle">Subtitle</Label>
              <Input name="subtitle" id="subtitle" value={form.subtitle} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="textarea" name="description" id="description" value={form.description} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="img">Image URL</Label>
              <Input name="img" id="img" value={form.img} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="offering_type">Offering Type</Label>
              <Input type="select" name="offering_type" id="offering_type" value={form.offering_type} onChange={handleChange}>
                <option>SERVICE</option>
                <option>EQUIPMENT</option>
                <option>SOFTWARE</option>
                <option>COURSE</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="category">Category</Label>
              <Input name="category" id="category" value={form.category} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="pricing_model">Pricing Model</Label>
              <Input type="select" name="pricing_model" id="pricing_model" value={form.pricing_model} onChange={handleChange}>
                <option>FIXED</option>
                <option>SUBSCRIPTION</option>
                <option>PER_USE</option>
                <option>FREE</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input type="number" name="price" id="price" value={form.price} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="url">URL</Label>
              <Input name="url" id="url" value={form.url} onChange={handleChange} />
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

export default connect(mapStateToProps)(PostOfferingPage);