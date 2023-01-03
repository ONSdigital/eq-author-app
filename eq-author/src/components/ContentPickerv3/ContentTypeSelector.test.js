import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import ContentTypeSelector from "./ContentTypeSelector";
import Theme from "contexts/themeContext";

import { ANSWER, METADATA } from "../ContentPickerSelectv3/content-types";

describe("ContentTypeSelector", () => {
  let props;
  const setContentType = jest.fn();

  beforeEach(() => {
    props = {
      contentType: ANSWER,
      contentTypes: [ANSWER, METADATA],
      setContentType,
    };
  });

  const renderContentTypeSelector = (props) => {
    return render(
      <Theme>
        <ContentTypeSelector {...props} />
      </Theme>
    );
  };

  it("should render each content type", () => {
    const { getByTestId } = renderContentTypeSelector(props);
    // Tests render for all different content types from the contentTypes prop
    props.contentTypes.forEach((selectedContentType) => {
      expect(
        getByTestId(`content-type-selector-${selectedContentType}`)
      ).toBeInTheDocument();
    });
  });

  it("should call onChange function", () => {
    const { getByTestId } = renderContentTypeSelector(props);
    const metadataRadio = getByTestId(`content-type-selector-${METADATA}`);
    fireEvent.click(metadataRadio);

    expect(setContentType).toHaveBeenCalledWith(METADATA);
  });
});
