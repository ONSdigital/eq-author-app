import React from "react";
import { shallow } from "enzyme";

import { UnwrappedRoutingAnswerContentPicker as RoutingAnswerContentPicker } from "./RoutingAnswerContentPicker";

describe("RoutingAnswerContentPicker", () => {
  it("should render", () => {
    const data = {
      availableAnswers: [
        {
          id: "answerid",
          displayName: "Answer",
          page: {
            id: "pageid",
            displayName: "Page",
            section: {
              id: "sectionid",
              displayName: "Section",
            },
          },
        },
      ],
    };
    expect(
      shallow(
        <RoutingAnswerContentPicker
          id="id"
          path="availableAnswers"
          data={data}
          selectedContentDisplayName="displayName"
          onSubmit={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });
});
