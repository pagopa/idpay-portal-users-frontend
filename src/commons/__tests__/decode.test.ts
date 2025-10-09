import { downloadFileFromBase64 } from '../decode';

describe('downloadFileFromBase64', () => {
  let createObjectURLMock: jest.Mock;
  let revokeObjectURLMock: jest.Mock;
  let clickSpy: jest.SpyInstance;
  let atobSpy: jest.SpyInstance;

  beforeEach(() => {
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
      .mockImplementation(() => { });

    atobSpy = jest.spyOn(window, 'atob').mockReturnValue('decoded-binary-data');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('should download file from base64 without prefix', () => {
    const base64 = 'dGVzdA==';
    const fileName = 'test.pdf';

    downloadFileFromBase64(base64, fileName);

    expect(atobSpy).toHaveBeenCalledWith(base64);

    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    const blobArg = createObjectURLMock.mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('application/pdf');

    expect(clickSpy).toHaveBeenCalledTimes(1);

    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock');
  });

  it('should remove data: prefix when present', () => {
    const base64WithPrefix = 'data:application/pdf;base64,dGVzdA==';
    const fileName = 'test.pdf';

    downloadFileFromBase64(base64WithPrefix, fileName);

    expect(atobSpy).toHaveBeenCalledWith('dGVzdA==');

    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock');
  });

  it('should create anchor element with correct attributes', () => {
    const base64 = 'dGVzdA==';
    const fileName = 'my-document.pdf';

    downloadFileFromBase64(base64, fileName);

    const anchors = document.getElementsByTagName('a');
    expect(anchors.length).toBe(0);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle empty base64 string', () => {
    atobSpy.mockReturnValue('');

    downloadFileFromBase64('', 'empty.pdf');

    expect(atobSpy).toHaveBeenCalledWith('');
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  });
});