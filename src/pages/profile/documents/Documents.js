import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem,
  Badge,
} from 'reactstrap';
import s from './Documents.module.scss';
import api from '../../../services/api';

const Documents = ({ currentUser }) => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);

  const fetchDocuments = async () => {
    try {
      const response = await api.getDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents', error);
      setDocuments([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDocuments();
    }
  }, [currentUser]);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (file) {
      try {
        await api.uploadDocument(file);
        fetchDocuments(); // Refresh the list after upload
      } catch (error) {
        console.error('Error uploading document', error);
      }
    }
  };

  const handleVerificationRequest = async (documentId) => {
    try {
      await api.requestDocumentVerification(documentId);
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Error requesting verification', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge color="success">Verified</Badge>;
      case 'pending':
        return <Badge color="warning">Pending</Badge>;
      case 'rejected':
        return <Badge color="danger">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={s.documentsContainer}>
      <h3>Documents & Credentials</h3>
      <p>
        Upload your documents and request verification.
      </p>
      <FormGroup>
        <Label for="document">Upload Document</Label>
        <Input type="file" name="document" id="document" onChange={onFileChange} />
        <Button color="primary" onClick={onFileUpload} className="mt-2">Upload</Button>
      </FormGroup>
      <ListGroup>
        {documents.map((doc) => (
          <ListGroupItem key={doc.document_id} className={s.documentItem}>
            <a href={`/${doc.file_path}`} target="_blank" rel="noopener noreferrer">
              {doc.file_name}
            </a>
            <div className={s.documentActions}>
              {getStatusBadge(doc.verification_status)}
              {doc.verification_status === 'not_verified' && (
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleVerificationRequest(doc.document_id)}
                >
                  Request Verification
                </Button>
              )}
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Documents);
