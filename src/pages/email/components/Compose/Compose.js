import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, convertToRaw } from 'react-draft-wysiwyg';
import { Input, Button } from 'reactstrap';
import api from '../../../../services/api';

import Widget from '../../../../components/Widget';

import s from './Compose.module.scss';

class Compose extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    to: '',
    subject: '',
  };

  componentDidMount() {
    if (this.props.data) {
      this.setState({
        to: this.props.data.from || '',
        subject: this.props.data.theme ? `Re: ${this.props.data.theme}` : '',
      });
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

    // This is a simplified example. In a real app, you'd get the
    // recipient's ID from the "to" field, maybe via a lookup.
    const recipientId = parseInt(to, 10);
    if (isNaN(recipientId)) {
      alert("Please enter a valid recipient ID.");
      return;
    }

    try {
      await api.createConversation({
        participantIds: [recipientId],
        subject,
        body,
      });
      alert('Message sent!');
    } catch (error) {
      console.error('Failed to send message', error);
      alert('Failed to send message.');
    }
  }

  render() {
    const { editorState, to, subject } = this.state;
    return (
      <Widget>
        <div className={s.compose}>
          <h4>Compose <span className="fw-semi-bold">New</span></h4>
          <Input type="text" name="to" placeholder="To" value={to} onChange={this.handleInputChange} />
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
