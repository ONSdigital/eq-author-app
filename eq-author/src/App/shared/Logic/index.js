import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import styled from "styled-components";
import { colors } from "constants/theme";
import { rgba } from "polished";
import { Grid, Column } from "components/Grid";

import EditorLayout from "components/EditorLayout";
import CustomPropTypes from "custom-prop-types";

import Badge from "components/Badge";
import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";

const activeClassName = "active";

const LogicMainCanvas = styled.div`
  display: flex;
  border: 1px solid ${colors.lightGrey};
  border-radius: 4px;
  background: ${colors.white};
`;

const LogicContainer = styled.div`
  padding: 0.8em;
  border-left: 1px solid ${colors.lightGrey};
`;

const StyledUl = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const MenuTitle = styled.div`
  width: 100%;
  padding: 1em 1.2em;
  font-weight: bold;
  border-bottom: 1px solid ${colors.lightGrey};
`;

const LogicLink = styled(NavLink)`
  --color-text: ${colors.black};
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1em;
  color: var(--color-text);
  font-size: 1em;
  border-left: 5px solid ${colors.lightGrey};
  border-bottom: 1px solid ${colors.lightGrey};

  &:hover {
    background: ${rgba(0, 0, 0, 0.2)};
  }

  &:active {
    outline: none;
  }

  &.${activeClassName} {
    --color-text: ${colors.white};

    background: ${colors.blue};
    border-left: 5px solid ${colors.orange};
    pointer-events: none;
  }
`;

const TABS = [
  {
    key: `routing`,
    label: "Routing logic",
  },
  {
    key: `skip`,
    label: "Skip logic",
  },
];

const LogicPage = ({ children, page }) => {
  useSetNavigationCallbacksForPage({
    page,
    folder: page?.folder,
    section: page?.section,
  });

  return (
    <EditorLayout
      design
      preview={page?.__typename !== "Folder"}
      logic
      validationErrorInfo={page?.validationErrorInfo}
      title={page?.displayName || page?.alias || ""}
      singleColumnLayout
      mainCanvasMaxWidth="80em"
      comments={page?.comments}
    >
      <LogicMainCanvas>
        <Grid>
          <Column gutters={false} cols={2.5}>
            <MenuTitle>Select your logic</MenuTitle>
            <StyledUl>
              {TABS.map(({ key, label }) => {
                const errors = page?.validationErrorInfo?.errors?.filter(
                  ({ type }) => type && type.includes(key)
                );
                return (
                  <li data-test={key} key={key}>
                    <LogicLink exact to={key} activeClassName="active" replace>
                      {label}
                      {errors?.length > 0 && (
                        <Badge variant="logic" data-test="badge-withCount">
                          {errors.length}
                        </Badge>
                      )}
                    </LogicLink>
                  </li>
                );
              })}
            </StyledUl>
          </Column>
          <Column gutters={false} cols={9.5}>
            <LogicContainer>{children}</LogicContainer>
          </Column>
        </Grid>
      </LogicMainCanvas>
    </EditorLayout>
  );
};

LogicPage.propTypes = {
  children: PropTypes.node.isRequired,
  page: CustomPropTypes.page,
};

export default LogicPage;
