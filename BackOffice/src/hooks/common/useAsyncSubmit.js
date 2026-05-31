import { useState } from 'react';

export const useAsyncSubmit = (submitFn, onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data) => {
    setError('');
    setLoading(true);
    let result;
    let isOk = false;
    try {
      result = await submitFn(data);
      setSuccess(true);
      isOk = true;
    } catch (err) {
      setError(err.message || 'Error occurred');
      setLoading(false);
      throw err;
    }
    setLoading(false);
    if (isOk && onSuccess) {
      onSuccess(result);
    }
    return result;
  };

  return { loading, error, success, handleSubmit, setError };
};
