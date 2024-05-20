import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import Item from ".";

import { colors } from "constants/theme";

const renderFolderPickerItem = (props) => {
  return render(<Item {...props} />);
};

describe("FolderPicker item", () => {
  let props;

  beforeEach(() => {
    props = {
      id: "folder-1",
      title: "Folder 1",
      subtitle: "1",
    };
  });

  it("should display heading if variant is heading", () => {
    const { getByTestId } = renderFolderPickerItem({
      id: "section-1",
      title: "Section 1",
      variant: "heading",
    });

    expect(getByTestId("folder-picker-item-section-1")).toHaveStyleRule(
      "background-color",
      colors.lightMediumGrey
    );
    expect(getByTestId("folder-picker-heading-section-1")).toHaveTextContent(
      "Section 1"
    );
  });

  it("should display title and subtitle when both are defined and variant is not heading", () => {
    const { getByTestId } = renderFolderPickerItem({
      ...props,
    });

    expect(getByTestId("folder-picker-title-folder-1")).toHaveTextContent(
      "Folder 1"
    );
    expect(getByTestId("folder-picker-subtitle-folder-1")).toHaveTextContent(
      "1"
    );
  });

  it("should display content badge for list collector folders", () => {
    const { getByTestId } = renderFolderPickerItem({
      ...props,
      isListCollector: true,
    });

    expect(
      getByTestId("folder-picker-content-badge-folder-1")
    ).toHaveTextContent("List collector");
  });

  it("should call onClick when clicked", () => {
    const onClick = jest.fn();
    const { getByTestId } = renderFolderPickerItem({
      ...props,
      onClick,
    });

    fireEvent.click(getByTestId("folder-picker-item-folder-1"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should call onClick when enter key is pressed", () => {
    const onClick = jest.fn();
    const { getByTestId } = renderFolderPickerItem({
      ...props,
      onClick,
    });

    fireEvent.keyUp(getByTestId("folder-picker-item-folder-1"), {
      key: "Enter",
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
