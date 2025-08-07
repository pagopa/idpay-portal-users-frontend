import { renderHook } from '@testing-library/react';
import { useEmailStore } from '../useEmailStore';

describe('useEmailStore', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('returns initial empty email and confirmEmail', () => {
        const { result } = renderHook(() => useEmailStore());
        expect(result.current.email).toBe('');
        expect(result.current.confirmEmail).toBe('');
    });

    it('sets and returns updated email and confirmEmail', () => {
        const { result, rerender } = renderHook(() => useEmailStore());

        result.current.setEmail('test@example.com');
        result.current.setConfirmEmail('test@example.com');

        rerender();

        expect(result.current.email).toBe('test@example.com');
        expect(result.current.confirmEmail).toBe('test@example.com');
    });

    it('persists values across multiple hook calls', () => {
        const { result: firstCall } = renderHook(() => useEmailStore());

        firstCall.current.setEmail('saved.email@example.com');
        firstCall.current.setConfirmEmail('saved.email@example.com');

        const { result: secondCall } = renderHook(() => useEmailStore());
        expect(secondCall.current.email).toBe('saved.email@example.com');
        expect(secondCall.current.confirmEmail).toBe('saved.email@example.com');
    });
});
