'use client';

import React from 'react';
import { Text, Stack } from '@mantine/core';

type ErrorBoundaryProps = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <Stack align="center" justify="center" style={{ padding: '2rem' }}>
            <Text c="red" fw={500}>
              Oops! Something went wrong...
            </Text>
          </Stack>
        )
      );
    }
    return this.props.children;
  }
}
