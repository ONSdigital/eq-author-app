import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import { get } from "lodash";

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
  questionnaireId,
  page,
  match,
  ...otherProps
}) => {
  const errorCount = get(
    page.confirmation,
    "validationErrorInfo.totalCount",
    0
  );
  return (
    <StyledPageItem data-test="question-confirmation-item" {...otherProps}>
      <StyledNavLink
        to={buildConfirmationPath({
          questionnaireId,
          confirmationId: page.confirmation.id,
          tab: match.params.tab,
        })}
        title={page.confirmation.displayName}
        icon={PlaybackIcon}
        data-test="question-confirmation-link"
        errorCount={errorCount}
      >
        {page.confirmation.displayName}
      </StyledNavLink>
    </StyledPageItem>
  );
};

UnwrappedPageConfirmationNavItem.fragments = {
  PageConfirmationNavItem: gql`
    fragment PageConfirmationNavItem on QuestionPage {
      id
      confirmation {
        id
        displayName
        validationErrorInfo {
          id
          totalCount
        }
      }
    }
  `,
};

UnwrappedPageConfirmationNavItem.propTypes = {
  sectionId: PropTypes.string.isRequired,
  questionnaireId: PropTypes.string.isRequired,
  page: CustomPropTypes.page,
  match: CustomPropTypes.match.isRequired,
};

export default withRouter(UnwrappedPageConfirmationNavItem);
