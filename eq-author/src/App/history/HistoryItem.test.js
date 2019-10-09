import React from "react";
import { render } from "tests/utils/rtl";
import HistoryItem from "./HistoryItem";

describe("History page", () => {
  let props = {
    questionnaireTitle: "my wonderful thing",
    userName: "Me",
    createdAt: "2019-09-26T18:22:58.461",
  };

  it("should format date correctly", () => {
    const { getByText } = render(<HistoryItem {...props} />);
    expect(getByText(`${props.userName} - 26/09/2019 at 18:22`)).toBeTruthy();
  });
});
