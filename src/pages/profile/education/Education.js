import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Widget from '../../../components/Widget';
import api from '../../../services/api';

const Education = ({ currentUser }) => {
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_year: '',
    end_year: '',
  });

  useEffect(() => {
    const fetchEducation = async () => {
      if (currentUser) {
        try {
          const { data } = await api.getEducation();
          setEducation(data);
        } catch (error) {
          console.error('Error fetching education:', error);
          setEducation([]);
        }
      }
    };
    fetchEducation();
  }, [currentUser]);

  const handleChange = (e) => {
    setNewEducation({ ...newEducation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.addEducation(newEducation);
      setEducation([...education, data]);
      setNewEducation({
        institution: '',
        degree: '',
        field_of_study: '',
        start_year: '',
        end_year: '',
      });
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  return (
    <div>
      <h2>Education</h2>
      <p>Add your educational background.</p>
      <Widget title="My Education" collapse close>
        <ul>
          {education.map(item => (
            <li key={item.id}>
              <strong>{item.institution}</strong><br />
              {item.degree} in {item.field_of_study}<br />
              {item.start_year} - {item.end_year}
            </li>
          ))}
        </ul>
      </Widget>
      <Widget title="Add Education">
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="institution">Institution</Label>
            <Input type="text" name="institution" id="institution" value={newEducation.institution} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="degree">Degree</Label>
            <Input type="text" name="degree" id="degree" value={newEducation.degree} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="field_of_study">Field of Study</Label>
            <Input type="text" name="field_of_study" id="field_of_study" value={newEducation.field_of_study} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="start_year">Start Year</Label>
            <Input type="text" name="start_year" id="start_year" value={newEducation.start_year} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="end_year">End Year</Label>
            <Input type="text" name="end_year" id="end_year" value={newEducation.end_year} onChange={handleChange} />
          </FormGroup>
          <Button type="submit" color="primary">Add Education</Button>
        </Form>
      </Widget>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Education);