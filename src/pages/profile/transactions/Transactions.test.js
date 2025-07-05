import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Transactions from './Transactions';

describe('Transactions Component', () => {
  const mockTransactions = [
    { id: 1, amount: 100, description: 'Transaction 1', status: 'Completed', date: '2023-01-01' },
    { id: 2, amount: 200, description: 'Transaction 2', status: 'Pending', date: '2023-02-01' },
  ];

  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTransactions),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should display a loading spinner initially', () => {
    render(<Transactions />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should fetch and display transactions', async () => {
    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('Transaction 1')).toBeInTheDocument();
      expect(screen.getByText('Transaction 2')).toBeInTheDocument();
    });
  });

  it('should display an error message if the fetch fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to fetch transactions'));
    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch transactions')).toBeInTheDocument();
    });
  });
});