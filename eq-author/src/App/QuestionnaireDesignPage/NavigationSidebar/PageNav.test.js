import React from "react";
import { shallow } from "enzyme";
import PageNav from "./PageNav";

describe("PageNav", () => {
  let component, handleDelete;

  const questionnaire = { id: "1", title: "Questionnaire" };
  const pages = [
    { id: "2", title: "Page" },
    { id: "4", title: "Confirmation Page", __typename: "QuestionConfirmation" },
  ];
  const section = { id: "3", title: "Section", pages: pages, number: 1 };

  beforeEach(() => {
    handleDelete = jest.fn(() => Promise.resolve());

    component = shallow(
      <PageNav
        questionnaire={questionnaire}
        section={section}
        onDelete={handleDelete}
      />
    );
  });

  it("should render", () => {
    expect(component).toMatchSnapshot();
  });
});
