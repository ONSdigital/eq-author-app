import React from "react";
import { shallow } from "enzyme";
import { UnwrappedTabs, Tab, activeClassName } from "./";
import { render, flushPromises, act } from "tests/utils/rtl";

describe("Tabs", () => {
  let props;

  beforeEach(() => {
    props = {
      match: {
        params: {
          questionnaireId: "1",
          sectionId: "2",
          pageId: "3",
        },
      },
      page: {
        validationErrorInfo: {
          totalCount: 1,
          errors: [{ id: "design-1" }],
        },
      },
    };
  });

  it("should render with design tab enabled by default", () => {
    const wrapper = shallow(<UnwrappedTabs {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render link to section if params are for a section", () => {
    delete props.match.params.pageId;
    const wrapper = shallow(<UnwrappedTabs {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a confirmation link when provided", () => {
    props.match.params.confirmationId = "4";
    const wrapper = shallow(<UnwrappedTabs {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should enable the preview tab when prop is passed", () => {
    const wrapper = shallow(<UnwrappedTabs {...props} preview />);
    expect(wrapper.find(`[data-test="preview"]`)).toMatchSnapshot();
  });

  it("should enable the Logic tab when prop is passed", () => {
    const wrapper = shallow(<UnwrappedTabs {...props} logic />);
    expect(wrapper.find(`[data-test="logic"]`)).toMatchSnapshot();
  });

  it("should provide the activeClassName for the enabled tabs", () => {
    const wrapper = shallow(<UnwrappedTabs {...props} logic preview />);
    wrapper.find(Tab).forEach(node => {
      expect(node.props()).toHaveProperty("activeClassName", activeClassName);
    });
  });

  it("should provide the validation error dot for the design tab if design page has error", async () => {
    const { getByTestId } = render(<UnwrappedTabs {...props} logic preview />);

    await act(async () => {
      await flushPromises();
    });

    expect(getByTestId("small-badge")).toBeTruthy();
  });
  it("should provide the validation error dot for the logic tab if design page has error", async () => {
    props.page.validationErrorInfo = {
      totalCount: 1,
      errors: [
        {
          id: "expression-routing-logic-test",
        },
        {
          id: "routing-logic-test",
        },
      ],
    };
    const { getAllByTestId } = render(
      <UnwrappedTabs {...props} logic preview />
    );

    await act(async () => {
      await flushPromises();
    });

    expect(getAllByTestId("small-badge").length).toBe(2);
  });
});
