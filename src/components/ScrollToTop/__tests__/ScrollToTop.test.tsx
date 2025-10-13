import { render } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("ScrollToTop", () => {
  const mockScrollTo = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, "scrollTo", {
      value: mockScrollTo,
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls window.scrollTo when pathname changes", () => {
    const mockUseLocation = useLocation as jest.Mock;

    mockUseLocation.mockReturnValueOnce({ pathname: "/page1" });
    const { rerender } = render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });

    mockUseLocation.mockReturnValueOnce({ pathname: "/page2" });
    rerender(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(mockScrollTo).toHaveBeenCalledTimes(2);
  });
});
