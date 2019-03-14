import React from "react";
import { shallow } from "enzyme";

import { StatelessMetaEditor } from "./MetaEditor";

import { TEXTFIELD } from "constants/answer-types";

const createWrapper = props => shallow(<StatelessMetaEditor {...props} />);

describe("MetaEditor", () => {
  let wrapper, props;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      fetchAnswers: jest.fn(),
      onChangeUpdate: jest.fn(),
      page: {
        id: "1",
        alias: "foobar",
        title: "<p>Hello world</p>",
        description: "<p>Description</p>",
        descriptionEnabled: true,
        guidance: "<p>Guidance</p>",
        guidanceEnabled: true,
        definitionLabel: "<p>Definition Label</p>",
        definitionContent: "<p>Definition Content</p>",
        definitionEnabled: true,
        additionalInfoLabel: "<p>Additional Info Label</p>",
        additionalInfoContent: "<p>Additional Info Content</p>",
        additionalInfoEnabled: true,
        answers: [{ id: "1", type: TEXTFIELD }],
        section: {
          id: "1",
          questionnaire: {
            id: "1",
            metadata: [],
          },
        },
      },
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
