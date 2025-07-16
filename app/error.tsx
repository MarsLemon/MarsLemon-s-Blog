'use client';

import { NextPage } from 'next';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const ErrorPage: NextPage<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
};

export default ErrorPage;