import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Collapsible from "components/Collapsible";

import PageTitleInput from "./PageTitleInput";

import { flowRight } from "lodash";
import { withQuestionnaire } from "components/QuestionnaireContext";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";

const PageTitleContainerWithoutCollapsible = styled.div``;

const PageTitleContainerWithCollapsible = styled.div`
  margin-left: 1em;
  margin-right: 1em;
`;

export class PageTitleContainer extends React.Component {
  render() {
    const { inCollapsible, page, onChange, onUpdate } = this.props;

    if (inCollapsible) {
      return (
        <Collapsible
          title="Page description"
          className="pageDescriptionCollapsible"
          defaultOpen
          withoutHideThis
          variant="content"
        >
          <PageTitleContainerWithCollapsible>
            <PageTitleInput
              pageDescription={page.pageDescription}
              onUpdate={onUpdate}
              onChange={onChange}
            />
          </PageTitleContainerWithCollapsible>
        </Collapsible>
      );
    }
    return (
      <PageTitleContainerWithoutCollapsible>
        <PageTitleInput
          pageDescription={page.pageDescription}
          onUpdate={onUpdate}
          onChange={onChange}
        />
      </PageTitleContainerWithoutCollapsible>
    );
  }
}

PageTitleContainer.fragments = {
  PageTitleContainer: gql`
    fragment Page on Page {
      pageDescription
    }
  `,
};

PageTitleContainer.propTypes = {
  inCollapsible: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  page: propType(PageTitleContainer.fragments.PageTitleContainer),
};

export default flowRight(withQuestionnaire)(PageTitleContainer);
