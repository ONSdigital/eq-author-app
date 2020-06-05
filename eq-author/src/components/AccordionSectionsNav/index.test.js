import React from "react";
import { render, fireEvent, act } from "tests/utils/rtl";
import SectionAccordion from "./";
import NavLink, {
  activeClassName,
} from "../../App/QuestionnaireDesignPage/NavigationSidebar/NavLink.js";

describe("Section Accordion", () => {
  it("default should render accordion as expanded", () => {
    const { getByTestId } = render(
      <SectionAccordion title="test" titleName="section1" isGroupOpen>
        section accordion panel
      </SectionAccordion>
    );
    expect(getByTestId("accordion-section1-body")).toBeVisible();
    expect(getByTestId("accordion-section1-button")).toBeVisible();
  });

  it("should focus on a section when active", async () => {
    const props = {
      to: "q/QID1/section/section1/design",
      "data-test": "nav-section-link",
      title: "TestName",
      icon: () => <svg />,
      errorCount: 0,
      isActive: () => true,
    };
    const SectionTitle = () => (
      <>
        <NavLink {...props}>section1</NavLink>
      </>
    );
    const { getByTestId } = render(
      <SectionAccordion
        title={<SectionTitle />}
        titleName="section1"
        isGroupOpen
      >
        section accordion panel
      </SectionAccordion>
    );
    expect(getByTestId("nav-section-link")).toBeVisible();

    expect(getByTestId("nav-section-link")).toHaveClass(activeClassName);
  });

  it("click on the arrow - it should open and close section accordion", async () => {
    const { getByTestId } = render(
      <SectionAccordion title="test" titleName="section2" isGroupOpen>
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
      <SectionAccordion title="test" titleName="section3" isGroupOpen>
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
