import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled, { css } from "styled-components";

import { colors } from "constants/theme";
import { UNIT } from "constants/answer-types";

import { getPages } from "utils/questionnaireUtils";

import Truncated from "components/Truncated";
import iconChevron from "./icon-chevron-small.svg";

export const MenuItemList = styled.ol`
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const MenuItem = styled.li`
  color: var(--color);
  display: flex;
  align-items: center;
  font-size: 0.9em;
  padding: 0 1em;
  height: 3.5em;
  background-color: ${colors.white};
  position: relative;
  cursor: pointer;
  border-top: 1px solid ${colors.lightGrey};
  border-bottom: 1px solid ${colors.lightGrey};
  margin: -1px 0;
  width: 100%;
  overflow: hidden;
  transition: all 100ms ease-in-out;

  &[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  &:focus {
    border: 1px solid ${colors.tertiary};
    border-color: ${colors.tertiary};
    z-index: 4;
  }
`;

export const ParentMenuItem = styled(MenuItem)`
  padding: 0 1em;

  &::after {
    content: "";
    position: absolute;
    background: url(${iconChevron});
    width: 16px;
    height: 16px;
    right: 0.5em;
    opacity: 0.5;
  }
  ${(props) =>
    props["aria-selected"] &&
    css`
      background-color: ${colors.lighterGrey};
      &::after {
        opacity: 1;
      }
      &:hover {
        background-color: ${colors.lighterGrey};
      }
    `}
`;

export const SubMenuItem = styled(MenuItem)`
  --color: ${colors.text};
  --colorSecondary: ${colors.textLight};
  --colorTertiary: ${colors.text};

  ${(props) =>
    props["aria-selected"] &&
    css`
      background-color: ${colors.primary};
      --color: ${colors.white};
      --colorSecondary: ${colors.white};

      border-color: ${colors.primary};
      z-index: 2;

      &:hover {
        background: ${colors.mediumBlue};
      }
    `}
`;

export const MenuItemTitles = styled.div`
  flex: 1 1 auto;
  overflow: hidden;
  margin-right: 0.5em;
`;

export const MenuItemTitle = styled.div`
  font-size: 1em;
  margin-bottom: 0.1em;
  color: var(--color);
`;

export const MenuItemSubtitle = styled.div`
  font-size: 0.9em;
  color: var(--colorSecondary);
`;

export const MenuItemType = styled.span`
  font-size: 10px;
  margin: 0 0.25em;
  background: #e4e8eb;
  padding: 0.3em 0.7em;
  border-radius: 1em;
  letter-spacing: 0.05em;
  color: var(--colorTertiary);
  flex: 0 1 auto;
  justify-self: flex-end;
`;

export const MenuItemPageType = styled.span`
  font-size: 10px;
  margin: 0 0.25em;
  background: #e4e8eb;
  padding: 0.3em 0.7em;
  border-radius: 1em;
  letter-spacing: 0.05em;
  color: var(--colorTertiary);
  flex: 0 1 auto;
  justify-self: flex-end;
  margin-right: 2em;
`;

export const SectionTitle = styled.div`
  background: #f4f5f6;
  font-size: 11px;
  padding: 0.3rem 1rem;
  letter-spacing: 0.05em;
  font-weight: bold;
  color: ${colors.darkGrey};
  line-height: 1.1;

  &:not(:first-of-type) {
    border-top: 1px solid ${colors.lightMediumGrey};
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid ${colors.lightMediumGrey};
  }
`;

const Menu = ({ data, onSelected, isSelected }) => {
  const onEnterUp = (event, section) => {
    if (event.keyCode === 13) {
      //13 is the enter keycode
      onSelected(section);
    }
  };

  return (
    <MenuItemList>
      {data &&
        data.map((section) => {
          const numOfPages = getPages({ sections: [section] }).length;

          if (numOfPages === 0) {
            return <React.Fragment />;
          }

          const sectionSelected = isSelected(section);

          return (
            <ParentMenuItem
              key={section.id}
              onClick={() => {
                onSelected(section);
              }}
              aria-selected={sectionSelected}
              tabIndex={sectionSelected ? "" : "0"}
              onKeyUp={(event) => onEnterUp(event, section)}
            >
              {section.displayName}
            </ParentMenuItem>
          );
        })}
    </MenuItemList>
  );
};

Menu.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
};

const SubMenu = ({ data, onSelected, isSelected, isDisabled }) => {
  const onEnterUp = (event, item) => {
    if (event.keyCode === 13) {
      //13 is the enter keycode
      onSelected(item);
    }
  };

  return (
    <MenuItemList>
      {data.map((page) =>
        page.answers.map((item) => {
          const enabledProps =
            isDisabled && isDisabled(item)
              ? {
                  disabled: true,
                }
              : {
                  "aria-selected": isSelected(item),
                  onClick: () => onSelected(item),
                  tabIndex: 0,
                  onKeyUp: (event) => onEnterUp(event, item),
                };

          return (
            <SubMenuItem key={item.id} {...enabledProps}>
              <MenuItemTitles>
                <MenuItemTitle>
                  <Truncated>{item.displayName}</Truncated>
                </MenuItemTitle>
                <MenuItemSubtitle>
                  <Truncated>{page.displayName}</Truncated>
                </MenuItemSubtitle>
              </MenuItemTitles>
              {page.pageType === "CalculatedSummaryPage" && (
                <MenuItemPageType>CALCULATED SUMMARY</MenuItemPageType>
              )}
              {page.folder?.__typename === "ListCollectorFolder" && (
                <MenuItemPageType>LIST COLLECTOR FOLLOW-UP</MenuItemPageType>
              )}
              <MenuItemType>{item.type.toUpperCase()}</MenuItemType>
              {item.type === UNIT && (
                <MenuItemType>
                  {item.properties.unit ? item.properties.unit : "Missing unit"}
                </MenuItemType>
              )}
            </SubMenuItem>
          );
        })
      )}
    </MenuItemList>
  );
};

SubMenu.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  isDisabled: PropTypes.func,
};

const FlatSectionMenu = ({ data, ...otherProps }) =>
  data.map((section) => {
    const numOfPages = getPages({ sections: [section] }).length;

    if (numOfPages === 0) {
      return <React.Fragment />;
    }

    return (
      <div key={section.id}>
        <SectionTitle>{section.displayName}</SectionTitle>
        <SubMenu
          data={section.folders.flatMap(({ pages }) => pages)}
          {...otherProps}
        />
      </div>
    );
  });

FlatSectionMenu.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
};

export { Menu, SubMenu, FlatSectionMenu };
