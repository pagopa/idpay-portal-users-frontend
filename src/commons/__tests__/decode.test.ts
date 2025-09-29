import { downloadFileFromBase64 } from '../decode';

describe('downloadFileFromBase64', () => {
  let fetchMock: jest.Mock;
  let createObjectURLMock: jest.Mock;
  let revokeObjectURLMock: jest.Mock;
  let clickSpy: jest.SpyInstance;
  let removeSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['dummy'], { type: 'application/pdf' })),
    });
    (globalThis as any).fetch = fetchMock;

    createObjectURLMock = jest.fn(() => 'blob:mock');
    revokeObjectURLMock = jest.fn();
    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: createObjectURLMock,
        revokeObjectURL: revokeObjectURLMock,
      },
      writable: true,
      configurable: true,
    });

    clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    removeSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'remove')
      .mockImplementation(function (this: HTMLAnchorElement) {
        this.parentNode?.removeChild(this);
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('adds prefix when missing and triggers download', async () => {
    await downloadFileFromBase64('dGVzdA==', 'file.pdf');

    expect(fetchMock).toHaveBeenCalledWith(
      'data:application/pdf;base64,dGVzdA=='
    );
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock');
  });

  it('uses provided data: URL when present', async () => {
    const prefixed = 'data:application/pdf;base64,abcd1234';
    await downloadFileFromBase64(prefixed, 'file.pdf');

    expect(fetchMock).toHaveBeenCalledWith(prefixed);
  });
});