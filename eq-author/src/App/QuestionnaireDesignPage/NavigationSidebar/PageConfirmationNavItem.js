import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";

import { buildConfirmationPath } from "utils/UrlUtils";
import NavLink from "./NavLink";
import PlaybackIcon from "./icon-playback.svg?inline";

const StyledPageItem = styled.li`
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledNavLink = styled(NavLink)`
  padding-left: 1.5em;
`;

export const UnwrappedPageConfirmationNavItem = ({
  sectionId,
  questionnaireId,
  page,
  match,
  ...otherProps
}) => (
  <>
    <StyledPageItem data-test="question-confirmation-item" {...otherProps}>
      <StyledNavLink
        to={buildConfirmationPath({
          questionnaireId,
          sectionId,
          pageId: page.id,
          confirmationId: page.confirmation.id,
          tab: match.params.tab || "design"
        })}
        title={page.displayName}
        icon={PlaybackIcon}
        data-test="question-confirmation-link"
      >
        {page.confirmation.displayName}
      </StyledNavLink>
    </StyledPageItem>
  </>
);

UnwrappedPageConfirmationNavItem.fragments = {
  PageConfirmationNavItem: gql`
    fragment PageConfirmationNavItem on QuestionPage {
      id
      confirmation {
        id
        displayName
      }
    }
  `
};

UnwrappedPageConfirmationNavItem.propTypes = {
  sectionId: PropTypes.string.isRequired,
  questionnaireId: PropTypes.string.isRequired,
  page: CustomPropTypes.page,
  match: CustomPropTypes.match
};

export default withRouter(UnwrappedPageConfirmationNavItem);
