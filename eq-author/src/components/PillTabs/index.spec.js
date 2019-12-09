import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import PillTabs from "./";

const OPTIONS = [
  {
    id: "completion-date",
    title: "Completion date",
    render: () => <p>I am the completion date</p>,
  },
  {
    id: "previous-answer",
    title: "Previous answer",
    render: () => <p>I am a previous answer</p>,
  },
  {
    id: "survey-data",
    title: "Survey data",
    render: () => (
      <p>
        Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna
        neque viverra justo nec ultrices dui sapien eget mi proin sed libero
        enim sed faucibus turpis in eu mi bibendum
      </p>
    ),
  },
  {
    id: "custom",
    title: "Custom",
    render: () => (
      <p>
        Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna
        neque viverra justo nec ultrices dui sapien eget mi proin sed libero
        enim sed faucibus turpis in eu mi bibendum
      </p>
    ),
  },
];

describe("PillTabs", () => {
  it("should render base tabs configured as per design", () => {
    const { queryByText } = render(
      <PillTabs value="1" options={OPTIONS} onChange={() => {}} />
    );
    expect(queryByText("I am the completion date")).toBeTruthy();
    expect(queryByText("I am a previous answer")).toBeFalsy();
  });

  it("should switch the tabs", async () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <PillTabs value="1" options={OPTIONS} onChange={onChange} />
    );
    fireEvent.click(getByText("Previous answer"));
    expect(onChange).toHaveBeenCalledWith("previous-answer");
  });
});
