import React from "react";
import { render, fireEvent, act, flushPromises } from "tests/utils/rtl";
import SectionAccordion from "./";
import NavLink, {
  activeClassName,
} from "../../App/QuestionnaireDesignPage/NavigationSidebar/NavLink.js";

describe("Section Accordion", () => {
  const isOpen = { open: true };

  let props, SectionTitleMock;

  const SectionTitle = () => (
    <>
      <NavLink {...props}>section1</NavLink>
    </>
  );

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  beforeEach(() => {
    SectionTitleMock = jest.fn(() => <SectionTitle />);
    props = {
      to: "q/QID1/section/section1/design",
      "data-test": "nav-section-link",
      title: "TestName",
      icon: () => <svg />,
      errorCount: 0,
      isActive: () => true,
    };
  });
  it("default should render accordion as expanded", () => {
    const { getByTestId } = render(
      <SectionAccordion
        title={SectionTitleMock}
        titleName="section1"
        isOpen={isOpen}
        identity={0}
        handleChange={jest.fn()}
      >
        section accordion panel
      </SectionAccordion>
    );
    expect(getByTestId("accordion-section1-body")).toBeVisible();
    expect(getByTestId("accordion-section1-button")).toBeVisible();
  });

  it("should focus on a section when active", async () => {
    const { getByTestId } = render(
      <SectionAccordion
        title={SectionTitleMock}
        titleName="section1"
        isOpen={isOpen}
        identity={0}
        handleChange={jest.fn()}
      >
        section accordion panel
      </SectionAccordion>
    );
    expect(getByTestId("nav-section-link")).toBeVisible();

    expect(getByTestId("nav-section-link")).toHaveClass(activeClassName);
  });

  it("click on the arrow - it should open and close section accordion", async () => {
    const { getByTestId } = render(
      <SectionAccordion
        title={SectionTitleMock}
        titleName="section2"
        isOpen={isOpen}
        identity={0}
        handleChange={jest.fn()}
      >
        section accordion panel2
      </SectionAccordion>
    );

    await act(async () => {
      await fireEvent.click(getByTestId("accordion-section2-button"));
    });
    expect(getByTestId("accordion-section2-body")).not.toBeVisible();

    await act(async () => {
      await fireEvent.click(getByTestId("accordion-section2-button"));
    });
    expect(getByTestId("accordion-section2-body")).toBeVisible();
  });

  it("click on the section title - it should not activate the accordion", async () => {
    const { getByTestId } = render(
      <SectionAccordion
        title={SectionTitleMock}
        titleName="section3"
        isOpen={isOpen}
        identity={0}
        handleChange={jest.fn()}
      >
        section accordion panel3
      </SectionAccordion>
    );

    expect(getByTestId("accordion-section3-body")).toBeVisible();

    await act(async () => {
      await fireEvent.click(getByTestId("accordion-section3-title"));
    });
    expect(getByTestId("accordion-section3-body")).toBeVisible();
  });
});
