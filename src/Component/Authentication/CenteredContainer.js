/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Container } from 'react-bootstrap';

export default function CenteredContainer({ children }) {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="w-100" style={{ maxWidth: '400px' }}>
        {children}
      </div>
    </Container>
  );
}
