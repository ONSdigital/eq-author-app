import React from "react";
import { shallow } from "enzyme";
import fakeId from "tests/utils/fakeId";
import { UnwrappedPageNavItem } from "./PageNavItem";

const page = {
  id: fakeId("3"),
  displayName: "Page title",
};

describe("PageNavItem", () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <UnwrappedPageNavItem
        questionnaireId={fakeId("1")}
        sectionId={fakeId("2")}
        title="Title"
        page={page}
        match={{
          params: {
            questionnaireId: fakeId("1"),
            sectionId: fakeId("2"),
            pageId: page.id,
          },
        }}
      />
    );
  });

  it("should render", () => {
    expect(component).toMatchSnapshot();
  });
});
