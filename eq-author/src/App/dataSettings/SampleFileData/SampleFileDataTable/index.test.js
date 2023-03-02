import React from "react";
import { render } from "tests/utils/rtl";

import MetadataTable from "./";

import mock from "./mock";

describe("MetadataTable", () => {
  let props, metadata, questionnaireId;
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
  });

  it("should render", () => {
    const { getByText } = render(<MetadataTable {...props} />);

    expect(getByText("Key")).toBeTruthy();
    expect(getByText("Alias")).toBeTruthy();
    expect(getByText("Type")).toBeTruthy();
    expect(getByText("Value")).toBeTruthy();
  });
});
