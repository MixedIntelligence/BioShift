import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Widget from '../../../components/Widget';
import s from '../../products/Products.module.scss';
import api from '../../../services/api';

const Publications = ({ currentUser }) => {
  const [publications, setPublications] = useState([]);
  const [newPublication, setNewPublication] = useState({ title: '', journal: '', year: '', url: '' });

  useEffect(() => {
    const fetchPublications = async () => {
      if (currentUser) {
        try {
          const { data } = await api.getPublications();
          setPublications(data);
        } catch (error) {
          console.error('Error fetching publications:', error);
          setPublications([]);
        }
      }
    };
    fetchPublications();
  }, [currentUser]);

  const handleChange = (e) => {
    setNewPublication({ ...newPublication, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: addedPublication } = await api.addPublication(newPublication);
      setPublications([...publications, addedPublication]);
      setNewPublication({ title: '', journal: '', year: '', url: '' });
    } catch (error) {
      console.error('Error adding publication:', error);
    }
  };

  return (
    <div>
      <h2>Publications</h2>
      <p>List your scientific publications, articles, and research papers here.</p>
      <Widget title="My Publications" collapse close>
        <table className={`table table-striped ${s.bootstrapTable}`}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Journal</th>
              <th>Year</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {publications.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.journal}</td>
                <td>{item.year}</td>
                <td><a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Widget>
      <Widget title="Add Publication">
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input type="text" name="title" id="title" value={newPublication.title} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="journal">Journal</Label>
            <Input type="text" name="journal" id="journal" value={newPublication.journal} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="year">Year</Label>
            <Input type="text" name="year" id="year" value={newPublication.year} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="url">URL</Label>
            <Input type="text" name="url" id="url" value={newPublication.url} onChange={handleChange} />
          </FormGroup>
          <Button type="submit" color="primary">Add Publication</Button>
        </Form>
      </Widget>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Publications);
