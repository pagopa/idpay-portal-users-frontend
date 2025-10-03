import { renderHook } from '@testing-library/react';
import { useCanAccessTOSStore } from '../useCanAccessTOSStore';

describe('useCanAccessTOSStore', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('returns initial false for canAccessTOS', () => {
    const { result } = renderHook(() => useCanAccessTOSStore());
    expect(result.current.canAccessTOS).toBe(false);
  });

  it('sets and returns updated canAccessTOS', () => {
    const { result, rerender } = renderHook(() => useCanAccessTOSStore());

    result.current.setCanAccessTOS(true);
    rerender();

    expect(result.current.canAccessTOS).toBe(true);
  });

  it('persists value across multiple hook calls', () => {
    const { result: firstCall } = renderHook(() => useCanAccessTOSStore());

    firstCall.current.setCanAccessTOS(true);

    const { result: secondCall } = renderHook(() => useCanAccessTOSStore());
    expect(secondCall.current.canAccessTOS).toBe(true);
  });
});
