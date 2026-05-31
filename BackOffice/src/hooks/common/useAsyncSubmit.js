import { useState } from 'react';

export const useAsyncSubmit = (submitFn, onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const result = await submitFn(data);
      setSuccess(true);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      setError(err.message || 'Error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, handleSubmit, setError };
};
