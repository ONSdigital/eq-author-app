import { shallow } from "enzyme";
import React from "react";

import { UnwrappedPreviewConfirmationRoute as PreviewConfirmationRoute } from "App/QuestionConfirmation/Preview/PreviewConfirmationRoute";

describe("PageConfirmationNavItem", () => {
  let questionConfirmation;
  beforeEach(() => {
    questionConfirmation = {
      id: "1",
      displayName: "Hello world",
      title: "<p>Hello world</p>",
      positive: {
        label: "positive label",
        description: "positive description"
      },
      negative: {
        label: "negative label",
        description: "negative description"
      },
      page: {
        id: "1",
        displayName: "page name",
        answers: [
          {
            id: "1",
            type: "Radio",
            options: [
              {
                id: "1",
                label: "label 1"
              },
              {
                id: "2",
                label: "label 2"
              }
            ]
          }
        ]
      }
    };
  });

  it("should render", () => {
    const wrapper = shallow(
      <PreviewConfirmationRoute
        loading={false}
        data={{ questionConfirmation }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a loading message when loading", () => {
    const wrapper = shallow(<PreviewConfirmationRoute loading data={null} />);
    expect(wrapper).toMatchSnapshot();
  });
});
