import React from "react";

import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  getAllByTestId,
  queryByAltText,
  getByText,
  prettyDOM,
  getByAltText,
  getByPlaceholderText
} from "@testing-library/react";

import Application from "../Application";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    console.log(prettyDOM(appointments));
  });
});