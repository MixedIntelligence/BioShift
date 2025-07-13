import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import { Input, Button } from 'reactstrap';
import api from '../../../../services/api';

import Widget from '../../../../components/Widget';

import s from './Compose.module.scss';

class Compose extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    to: '',
    subject: '',
    connections: [],
  };

  async componentDidMount() {
    if (this.props.data) {
      this.setState({
        to: this.props.data.from || '',
        subject: this.props.data.theme ? `Re: ${this.props.data.theme}` : '',
      });
    }
    // Fetch 1st-degree connections for the To field
    try {
      const res = await api.getConnections();
      this.setState({ connections: res.data || [] });
    } catch (err) {
      // fallback: no connections
      this.setState({ connections: [] });
    }
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleSend = async () => {
    const { editorState, to, subject } = this.state;
    const content = convertToRaw(editorState.getCurrentContent());
    const body = content.blocks.map(block => block.text).join('\n');

    // Use new /compose endpoint for Tier 2 messaging
    const recipientId = parseInt(to, 10);
    if (isNaN(recipientId)) {
      alert("Please select a valid connection.");
      return;
    }
    try {
      await api.composeMessage({ recipientId, subject, body });
      alert('Message sent!');
    } catch (error) {
      console.error('Failed to send message', error);
      alert('Failed to send message.');
    }
  }

  render() {
    const { editorState, to, subject, connections } = this.state;
    return (
      <Widget>
        <div className={s.compose}>
          <h4>Compose <span className="fw-semi-bold">New</span></h4>
          <Input type="select" name="to" value={to} onChange={this.handleInputChange}>
            <option value="">Select connection...</option>
            {connections.map(conn => (
              <option key={conn.id} value={conn.id}>{conn.name || conn.username}</option>
            ))}
          </Input>
          <Input type="text" name="subject" placeholder="Subject" value={subject} onChange={this.handleInputChange} />
          <Editor
            editorState={editorState}
            wrapperClassName={s.wysiwygWrapper}
            editorClassName={s.wysiwygEditor}
            toolbarClassName={s.wysiwygToolbar}
            onEditorStateChange={this.onEditorStateChange}
          />
          <div className="text-md-right mt-xs">
            <Button color="gray">Discard</Button>
            <Button color="gray">Save</Button>
            <Button color="danger" onClick={this.handleSend}>Send</Button>
          </div>
        </div>
      </Widget>
    );
  }
}

Compose.propTypes = {
  data: PropTypes.shape({
    from: PropTypes.string,
    theme: PropTypes.string,
  }),
};

Compose.defaultProps = {
  data: null,
};

export default Compose;
