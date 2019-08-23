import React from "react";
import { shallow } from "enzyme";

import MetadataTable from "./";

import mock from "./mock";

const render = (props = {}) => shallow(<MetadataTable {...props} />);

describe("MetadataTable", () => {
  let props, metadata, questionnaireId, wrapper;
  beforeEach(() => {
    questionnaireId = "1";

    metadata = mock;

    props = {
      metadata: metadata,
      questionnaireId: questionnaireId,
      onAdd: jest.fn(),
      onDelete: jest.fn(),
      onUpdate: jest.fn(),
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
