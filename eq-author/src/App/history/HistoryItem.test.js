import React from "react";
import { render } from "tests/utils/rtl";
import HistoryItem from "./HistoryItem";

//eslint-disable-next-line react/prop-types
jest.mock("components/RichTextEditor", () => ({ onUpdate }) => {
  const handleInputChange = (event) =>
    onUpdate({
      value: event.target.value,
    });
  return <input data-test="textbox" onChange={handleInputChange} />;
});

describe("History page", () => {
  let props = {
    itemId: "item-1",
    questionnaireId: "q-1",
    questionnaireTitle: "my wonderful thing",
    userName: "Me",
    userId: "user-1",
    currentUser: {
      id: "user-2",
      email: "wubbalubba@dubdub.com",
    },
    createdAt: "2019-09-26T18:22:58.461",
    publishStatus: "Questionnaire created",
    type: "system",
    handleDeleteNote: jest.fn(),
    handleUpdateNote: jest.fn(),
  };

  it("should format date correctly", () => {
    const { getByText } = render(<HistoryItem {...props} />);
    expect(getByText(`${props.userName} - 26/09/2019 at 18:22`)).toBeTruthy();
  });
});
