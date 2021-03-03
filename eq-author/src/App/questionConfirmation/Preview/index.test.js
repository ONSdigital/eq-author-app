import React from "react";
import { shallow } from "enzyme";

import MultipleChoiceAnswerOptionsReplay from "./MultipleChoiceAnswerOptionsReplay";
import { UnwrappedPreviewConfirmationRoute as PreviewConfirmationRoute } from "./";

describe("Question Confirmation Preview", () => {
  let questionConfirmation;
  beforeEach(() => {
    questionConfirmation = {
      id: "1",
      displayName: "Hello world",
      title: "<p>Hello world</p>",
      qCode: "",
      positive: {
        id: "1",
        label: "positive label",
        description: "positive description",
        validationErrorInfo: [],
      },
      negative: {
        id: "2",
        label: "negative label",
        description: "negative description",
        validationErrorInfo: [],
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
                label: "label 1",
              },
              {
                id: "2",
                label: "label 2",
              },
            ],
            mutuallyExclusiveOption: {
              id: "3",
              label: "label 3",
            },
          },
        ],
      },
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

  it("should correctly strip and render piped answers", () => {
    const title = `<p>foo<span data-piped="x" data-id="1">[bar]</span></p>`;
    const wrapper = shallow(
      <PreviewConfirmationRoute
        loading={false}
        data={{ questionConfirmation: { ...questionConfirmation, title } }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should not render replay options when there are no answer options", () => {
    const wrapper = shallow(
      <PreviewConfirmationRoute
        loading={false}
        data={{
          questionConfirmation: {
            ...questionConfirmation,
            page: { id: "1", displayName: "foobar", answers: [] },
          },
        }}
      />
    );

    expect(
      wrapper.find(MultipleChoiceAnswerOptionsReplay).exists()
    ).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a loading message when loading", () => {
    const wrapper = shallow(<PreviewConfirmationRoute loading data={null} />);
    expect(wrapper).toMatchSnapshot();
  });
});
