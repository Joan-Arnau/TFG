import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsyncSubmit } from './useAsyncSubmit';

describe('useAsyncSubmit Custom Hook', () => {
  test('returns initial states correctly', () => {
    const submitFn = vi.fn();
    const { result } = renderHook(() => useAsyncSubmit(submitFn));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
    expect(result.current.success).toBe(false);
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.setError).toBe('function');
  });

  test('manages states successfully during a successful submission', async () => {
    const mockData = { id: 1, name: 'Shop' };
    const submitFn = vi.fn().mockResolvedValue(mockData);
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useAsyncSubmit(submitFn, onSuccess));

    let response;
    await act(async () => {
      response = await result.current.handleSubmit({ name: 'New Shop' });
    });

    // After resolution
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBe('');
    expect(response).toEqual(mockData);

    expect(submitFn).toHaveBeenCalledWith({ name: 'New Shop' });
    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });

  test('manages states and catches errors during a failed submission', async () => {
    const errorInstance = new Error('Invalid input data');
    const submitFn = vi.fn().mockRejectedValue(errorInstance);
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useAsyncSubmit(submitFn, onSuccess));

    await act(async () => {
      try {
        await result.current.handleSubmit({ name: 'Bad Input' });
      } catch (err) {
        expect(err).toBe(errorInstance);
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('Invalid input data');
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test('clears previous errors when a new submission starts', async () => {
    const submitFn = vi.fn()
      .mockRejectedValueOnce(new Error('First Failure'))
      .mockResolvedValueOnce({ status: 'Success' });

    const { result } = renderHook(() => useAsyncSubmit(submitFn));

    // 1. First run (failed)
    await act(async () => {
      try {
        await result.current.handleSubmit({});
      } catch (err) {
        expect(err.message).toBe('First Failure');
      }
    });

    expect(result.current.error).toBe('First Failure');

    // 2. Second run (successful)
    await act(async () => {
      await result.current.handleSubmit({});
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBe('');
  });

  test('setError manually changes the error state', () => {
    const { result } = renderHook(() => useAsyncSubmit(vi.fn()));

    act(() => {
      result.current.setError('Custom Manual Error');
    });

    expect(result.current.error).toBe('Custom Manual Error');
  });
});
