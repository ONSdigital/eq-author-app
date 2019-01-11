import React from "react";
import { shallow } from "enzyme";
import { Query } from "react-apollo";

import AvailablePipingContentQuery, {
  GET_PIPING_CONTENT_PAGE,
  GET_PIPING_CONTENT_SECTION,
  GET_PIPING_CONTENT_QUESTION_CONFIRMATION,
} from "components/RichTextEditor/AvailablePipingContentQuery";

describe("Available Piping Content Query", () => {
  const sectionId = "1";
  const pageId = "2";
  const confirmationId = "3";
  const questionnaireId = "4";

  it("should make a query for section data when on a section page", () => {
    const wrapper = shallow(
      <AvailablePipingContentQuery
        sectionId={sectionId}
        questionnaireId={questionnaireId}
      >
        {() => {}}
      </AvailablePipingContentQuery>
    );
    expect(wrapper.find(Query).props()).toMatchObject({
      variables: { input: { sectionId, questionnaireId } },
      query: GET_PIPING_CONTENT_SECTION,
    });
  });

  it("should make a query for page data when on a question page", () => {
    const wrapper = shallow(
      <AvailablePipingContentQuery
        sectionId={sectionId}
        pageId={pageId}
        questionnaireId={questionnaireId}
      >
        {() => {}}
      </AvailablePipingContentQuery>
    );
    expect(wrapper.find(Query).props()).toMatchObject({
      variables: { input: { pageId, questionnaireId } },
      query: GET_PIPING_CONTENT_PAGE,
    });
  });

  it("should make a query for confirmation data when on a question confirmation page", () => {
    const wrapper = shallow(
      <AvailablePipingContentQuery
        sectionId={sectionId}
        pageId={pageId}
        confirmationId={confirmationId}
        questionnaireId={questionnaireId}
      >
        {() => {}}
      </AvailablePipingContentQuery>
    );
    expect(wrapper.find(Query).props()).toMatchObject({
      variables: { id: confirmationId },
      query: GET_PIPING_CONTENT_QUESTION_CONFIRMATION,
    });
  });
});
