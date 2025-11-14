import { renderHook, act } from '@testing-library/react';
import { useEmailAssistanceStore } from '../useEmailAssistanceStore';

describe('useEmailAssistanceStore', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should initialize with empty email', () => {
    const { result } = renderHook(() => useEmailAssistanceStore());
    expect(result.current.email).toBe('');
  });

  it('should update email when setEmail is called', () => {
    const { result, rerender } = renderHook(() => useEmailAssistanceStore());

    act(() => {
      result.current.setEmail('test@example.com');
    });

    rerender();

    expect(result.current.email).toBe('test@example.com');
  });

  it('should persist email across multiple hook calls', () => {
    const { result: first } = renderHook(() => useEmailAssistanceStore());

    act(() => {
      first.current.setEmail('cached@example.com');
    });

    const { result: second } = renderHook(() => useEmailAssistanceStore());
    expect(second.current.email).toBe('cached@example.com');
  });
});