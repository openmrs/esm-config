import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import ConfigurableLink from "./react-configurable-link";
import { navigate } from "./navigate";

jest.mock("./navigate");
const mockNavigate = navigate as jest.Mock;
window.openmrsBase = "/openmrs";
window.spaBase = "/spa";
window.getOpenmrsSpaBase = () => "/openmrs/spa";

describe(`ConfigurableLink`, () => {
  beforeEach(mockNavigate.mockClear());

  it(`interpolates the link and calls navigate on normal click`, async () => {
    const path = "${openmrsSpaPath}/home";
    const { getByText, debug } = render(
      <ConfigurableLink to={path} className="fancy-link">
        SPA Home
      </ConfigurableLink>
    );
    const link = getByText("SPA Home");
    expect(link).toBeTruthy();
    debug();
    expect(link.closest("a")).toHaveClass("fancy-link");
    expect(link.closest("a")).toHaveAttribute("href", "/openmrs/spa/home");
    fireEvent.click(link, { button: 3 }); // right-click
    expect(navigate).not.toHaveBeenCalled();
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledWith({ to: path });
  });
});
