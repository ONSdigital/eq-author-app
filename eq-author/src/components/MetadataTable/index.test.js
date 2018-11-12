import React from "react";
import { shallow } from "enzyme";

import MetadataTable from "components/MetadataTable";
import { AddRowButton } from "components/DataTable/Controls";

import mock from "components/MetadataTable/mock";

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
      onUpdate: jest.fn()
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onAdd event handler when adding a new row", () => {
    wrapper.find(AddRowButton).simulate("click");
    expect(props.onAdd).toHaveBeenCalledWith(questionnaireId);
  });
});
