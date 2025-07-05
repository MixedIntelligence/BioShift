import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import s from './Payments.module.scss';
import api from '../../../services/api';

const Payments = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchBankAccounts();
    }
  }, [currentUser]);

  const fetchBankAccounts = async () => {
    try {
      const response = await api.getPayments();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setAccounts([]);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bank_accounts', {
        accountHolderName,
        accountNumber,
        routingNumber,
      });
      fetchBankAccounts();
      setAccountHolderName('');
      setAccountNumber('');
      setRoutingNumber('');
    } catch (error) {
      console.error('Error adding bank account:', error);
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      await api.delete(`/bank_accounts/${id}`);
      fetchBankAccounts();
    } catch (error) {
      console.error('Error deleting bank account:', error);
    }
  };

  return (
    <div className={s.root}>
      <h2>Banking & Payouts</h2>
      <Form onSubmit={handleAddAccount}>
        <FormGroup>
          <Label for="accountHolderName">Account Holder Name</Label>
          <Input
            type="text"
            name="accountHolderName"
            id="accountHolderName"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="accountNumber">Account Number</Label>
          <Input
            type="text"
            name="accountNumber"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="routingNumber">Routing Number</Label>
          <Input
            type="text"
            name="routingNumber"
            id="routingNumber"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit">Add Bank Account</Button>
      </Form>
      <hr />
      <h3>Your Bank Accounts</h3>
      <ListGroup>
        {accounts.map((account) => (
          <ListGroupItem key={account.id}>
            {account.account_holder_name} - ****{account.account_number.slice(-4)}
            <Button
              color="danger"
              size="sm"
              className="float-right"
              onClick={() => handleDeleteAccount(account.id)}
            >
              Delete
            </Button>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Payments);