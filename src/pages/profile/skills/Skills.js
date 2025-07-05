import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Widget from '../../../components/Widget';
import api from '../../../services/api';

const Skills = ({ currentUser }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      if (currentUser) {
        try {
          const { data } = await api.getSkills();
          setSkills(data);
        } catch (error) {
          console.error('Error fetching skills:', error);
          setSkills([]);
        }
      }
    };
    fetchSkills();
  }, [currentUser]);

  const handleChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.addSkill({ upskill: newSkill });
      setSkills([...skills, { id: Date.now(), skill: newSkill }]);
      setNewSkill('');
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  return (
    <div>
      <h2>Skills</h2>
      <p>Add your skills and certifications.</p>
      <Widget title="My Skills" collapse close>
        <ul>
          {skills.map(item => (
            <li key={item.id}>{item.skill}</li>
          ))}
        </ul>
      </Widget>
      <Widget title="Add Skill">
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="skill">Skill</Label>
            <Input type="text" name="skill" id="skill" value={newSkill} onChange={handleChange} />
          </FormGroup>
          <Button type="submit" color="primary">Add Skill</Button>
        </Form>
      </Widget>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Skills);