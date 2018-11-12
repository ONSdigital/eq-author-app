import React from "react";
import { shallow } from "enzyme";
import { forEach } from "lodash";

import { StatelessRow } from "components/MetadataTable/Row";
import { DeleteRowButton } from "components/DataTable/Controls";

const render = (props = {}) => shallow(<StatelessRow {...props} />);

const metadataTypes = [
  {
    id: "1",
    key: "tx_id",
    alias: "test_alias",
    type: "Text",
    textValue: "text",
    languageValue: null,
    regionValue: null,
    dateValue: null
  },
  {
    id: "2",
    key: "iat",
    alias: "date_alias",
    type: "Date",
    textValue: null,
    languageValue: null,
    regionValue: null,
    dateValue: "2018-09-17"
  },
  {
    id: "3",
    key: "iat",
    alias: "region_alias",
    type: "Region",
    textValue: null,
    languageValue: null,
    regionValue: "GB_ENG",
    dateValue: null
  },
  {
    id: "4",
    key: "iat",
    alias: "language_alias",
    type: "Language",
    textValue: null,
    languageValue: "cy",
    regionValue: null,
    dateValue: null
  }
];

describe("MetadataTable", () => {
  let props, metadata, questionnaireId, wrapper;
  beforeEach(() => {
    questionnaireId = "1";

    metadata = metadataTypes[0];

    props = {
      metadata: metadata,
      questionnaireId: questionnaireId,
      onDelete: jest.fn(),
      onUpdate: jest.fn(),
      onChange: jest.fn(),
      usedKeys: []
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly render different types of metadata", () => {
    forEach(metadataTypes, metadata => {
      expect(
        render({
          ...props,
          metadata
        })
      ).toMatchSnapshot();
    });
  });

  it("should call onDelete event handler when deleting a metadata", () => {
    wrapper.find(DeleteRowButton).simulate("click");
    expect(props.onDelete).toHaveBeenCalledWith(questionnaireId, metadata.id);
  });
});
