import React from "react";
import UnwrappedDate from "./";
import { MISSING_LABEL, buildLabelError } from "constants/validationMessages";
import { lowerCase } from "lodash";

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

describe("Date", () => {
  let answer;
  let onChange;
  let onUpdate;
  let props;
  let multipleAnswers;

  const createWrapper = (props) => {
    return <UnwrappedDate {...props} />;
  };

  beforeEach(() => {
    answer = {
      id: "ansID1",
      title: "Date title",
      description: "date description",
      label: "",
      type: "Date",
      guidance: "Guidance",
      secondaryLabel: null,
      secondaryLabelDefault: "",
      properties: {},
      displayName: "",
      qCode: "",
      advancedProperties: true,
      options: [
        {
          id: "option-1",
          label: "option-label",
          mutuallyExclusive: false,
        },
      ],
    };

    onChange = jest.fn();
    onUpdate = jest.fn();
    multipleAnswers = false;

    props = {
      id: "1",
      answer,
      onChange,
      onUpdate,
      multipleAnswers,
      type: "Date",
    };
  });
  it("should render", () => {
    expect(createWrapper(props)).toMatchSnapshot();
  });

  it("shows missing label error", () => {
    expect(
      buildLabelError(MISSING_LABEL, `${lowerCase(props.type)}`, 8, 7)
    ).toEqual("Enter a date label");
  });
});
