'use client';

import { NextPage } from 'next';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const ErrorPage: NextPage<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
};

export default ErrorPage;