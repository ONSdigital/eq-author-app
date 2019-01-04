import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";

import { buildQuestionnairePath } from "utils/UrlUtils";
import NavLink from "./NavLink";
import PageIcon from "./icon-questionpage.svg?inline";

const StyledPageItem = styled.li`
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  align-items: center;
`;

export const UnwrappedPageNavItem = ({
  sectionId,
  questionnaireId,
  page,
  match,
  ...otherProps
}) => (
  <StyledPageItem data-test="page-item" {...otherProps}>
    <NavLink
      to={buildQuestionnairePath({
        questionnaireId,
        sectionId,
        pageId: page.id,
        tab: match.params.tab
      })}
      title={page.displayName}
      icon={PageIcon}
      data-test="nav-page-link"
    >
      {page.displayName}
    </NavLink>
  </StyledPageItem>
);

UnwrappedPageNavItem.fragments = {
  PageNavItem: gql`
    fragment PageNavItem on QuestionPage {
      id
      title
      position
      displayName
      confirmation {
        id
      }
    }
  `
};

UnwrappedPageNavItem.propTypes = {
  sectionId: PropTypes.string.isRequired,
  questionnaireId: PropTypes.string.isRequired,
  page: CustomPropTypes.page,
  match: CustomPropTypes.match
};

export default withRouter(UnwrappedPageNavItem);
