import { renderHook } from '@testing-library/react';
import { useTOSCheckboxStore } from '../useTOSCheckboxStore';

describe('useTOSCheckboxStore', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('returns initial unchecked state', () => {
    const { result } = renderHook(() => useTOSCheckboxStore());
    expect(result.current.tosAccepted).toBe(false);
  });

  it('sets and returns updated state (true) after rerender', () => {
    const { result, rerender } = renderHook(() => useTOSCheckboxStore());

    result.current.setTosAccepted(true);
    rerender();

    expect(result.current.tosAccepted).toBe(true);
  });

  it('persists value across multiple hook calls', () => {
    const { result: firstCall } = renderHook(() => useTOSCheckboxStore());
    firstCall.current.setTosAccepted(true);

    const { result: secondCall } = renderHook(() => useTOSCheckboxStore());
    expect(secondCall.current.tosAccepted).toBe(true);
  });

  it('can toggle back to false and persists across calls', () => {
    const { result: firstCall } = renderHook(() => useTOSCheckboxStore());
    firstCall.current.setTosAccepted(true);
    firstCall.current.setTosAccepted(false);

    const { result: secondCall } = renderHook(() => useTOSCheckboxStore());
    expect(secondCall.current.tosAccepted).toBe(false);
  });
});
