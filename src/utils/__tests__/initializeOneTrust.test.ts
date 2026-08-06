const mockInitializeCookieOneTrust = jest.fn();

jest.mock('../oneTrustLoader', () => ({
  initializeCookieOneTrust: () => mockInitializeCookieOneTrust(),
}));

describe('initializeOneTrust', () => {
  it('logs Cookie OneTrust initialization failures', async () => {
    const error = new Error('failed');
    mockInitializeCookieOneTrust.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    await import('../initializeOneTrust');
    await Promise.resolve();

    expect(mockInitializeCookieOneTrust).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to initialize Cookie OneTrust: ',
      error
    );

    consoleSpy.mockRestore();
  });
});
