// Save as: __tests__/app.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../app/page';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Animate Your Still Images')).toBeInTheDocument();
  });

  // Add more tests as needed
});