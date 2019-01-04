import React from "react";
import { shallow } from "enzyme";
import { UnwrappedPageNavItem } from "./PageNavItem";

const page = {
  id: "3",
  displayName: "Page title"
};

describe("PageNavItem", () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <UnwrappedPageNavItem
        questionnaireId={"1"}
        sectionId={"2"}
        title="Title"
        page={page}
        match={{
          params: { questionnaireId: "1", sectionId: "2", pageId: page.id }
        }}
      />
    );
  });

  it("should render", () => {
    expect(component).toMatchSnapshot();
  });
});
