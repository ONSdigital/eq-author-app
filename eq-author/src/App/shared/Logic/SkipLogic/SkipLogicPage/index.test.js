import React from "react";
import { shallow } from "enzyme";

import SkipLogicPage from "./";
import SkipLogicEditor from "./SkipLogicEditor";
import NoSkipConditions from "./NoSkipConditions";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(() => [jest.fn()]),
}));

describe("Skip Condition Page", () => {
  const defaultPage = {
    id: "1",
    displayName: "test",
    position: 1,
    section: {
      position: 0,
    },
    folder: {
      position: 0,
    },
    skipConditions: null,
    validationErrorInfo: { id: "1", errors: [], totalCount: 0 },
  };

  it("should show the no skip condition message when there is no skip conditions for a page", () => {
    const wrapper = shallow(<SkipLogicPage page={defaultPage} />);
    expect(wrapper.find(NoSkipConditions)).toBeTruthy();
  });

  it("should render the editor when there is a skip condition", () => {
    const wrapper = shallow(
      <SkipLogicPage
        page={{
          ...defaultPage,
          skipConditions: [{ id: "2", expressions: [] }],
        }}
      />
    );
    expect(wrapper.find(SkipLogicEditor)).toBeTruthy();
  });

  it("should signal to NoSkipConditions if it's the first page in a questionnaire", () => {
    const wrapper = shallow(
      <SkipLogicPage
        page={{
          ...defaultPage,
          position: 0,
        }}
      />
    );

    expect(wrapper.find(NoSkipConditions).props().isFirstQuestion).toBeTruthy();
  });
});
