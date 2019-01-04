import DeleteConfirmDialog from "components/DeleteConfirmDialog";

import React from "react";
import { shallow } from "enzyme";

describe("DeleteConfirmDialog", () => {
  let wrapper;

  let mockMutations;
  let page;

  beforeEach(() => {
    mockMutations = {
      onDelete: jest.fn(),
      onClose: jest.fn()
    };

    page = {
      __typename: "Page",
      id: "1",
      title: "",
      description: "",
      guidance: ""
    };

    wrapper = shallow(
      <DeleteConfirmDialog
        {...mockMutations}
        page={page}
        alertText="I am an alert"
        icon={"icon.svg"}
      />
    );
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should call deletePage handler when delete button is clicked", () => {
    const deleteBtn = wrapper.find("[data-test='btn-delete-modal']");
    deleteBtn.simulate("click");
    expect(mockMutations.onDelete).toHaveBeenCalled();
  });

  it("should call close handler when cancel button is clicked", () => {
    const cancelBtn = wrapper.find("[data-test='btn-cancel-modal']");
    cancelBtn.simulate("click");
    expect(mockMutations.onClose).toHaveBeenCalled();
  });
});
