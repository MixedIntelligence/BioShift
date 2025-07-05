import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Agreements from './Agreements';

describe('Agreements Component', () => {
  const mockAgreements = [
    { id: 1, title: 'Agreement 1', status: 'Active', date: '2023-01-01' },
    { id: 2, title: 'Agreement 2', status: 'Inactive', date: '2023-02-01' },
  ];

  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockAgreements),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should display a loading spinner initially', () => {
    render(<Agreements />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should fetch and display agreements', async () => {
    render(<Agreements />);

    await waitFor(() => {
      expect(screen.getByText('Agreement 1')).toBeInTheDocument();
      expect(screen.getByText('Agreement 2')).toBeInTheDocument();
    });
  });

  it('should display an error message if the fetch fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to fetch agreements'));
    render(<Agreements />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch agreements')).toBeInTheDocument();
    });
  });
});