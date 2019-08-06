import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";
import Truncated from "components/Truncated";

const MenuItemList = styled.ol`
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  color: var(--color);
  display: flex;
  align-items: center;
  font-size: 0.9em;
  padding: 0 1em;
  height: 3.5em;
  background-color: white;
  position: relative;
  cursor: pointer;
  border-top: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
  margin: -1px 0;
  width: 100%;
  overflow: hidden;
  transition: all 100ms ease-in-out;

  &[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  &:focus {
    border: none;
    outline: 2px solid ${colors.orange};
    z-index: 1;
    offset-position: -2px;
  }
`;

const SubMenuItem = styled(MenuItem)`
  --color: ${colors.text};
  --colorSecondary: ${colors.textLight};
  --colorTertiary: ${colors.text};

  &[aria-selected="true"] {
    --color: ${colors.white};
    --colorSecondary: ${colors.white};

    background: ${colors.primary};
    border-color: #377090;
    z-index: 2;

    &:hover {
      background: #397596;
    }
  }
`;

const MenuItemTitles = styled.div`
  flex: 1 1 auto;
  overflow: hidden;
  margin-right: 0.5em;
`;

const MenuItemTitle = styled.div`
  font-size: 1em;
  margin-bottom: 0.1em;
  color: var(--color);
`;

const MenuItemSubtitle = styled.div`
  font-size: 0.9em;
  color: var(--colorSecondary);
`;

const MenuItemType = styled.span`
  font-size: 10px;
  background: #e4e8eb;
  padding: 0.3em 0.7em;
  border-radius: 1em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--colorTertiary);
  flex: 0 1 auto;
  justify-self: flex-end;
`;

const SectionTitle = styled.div`
  background: #f4f5f6;
  font-size: 11px;
  padding: 0.3rem 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: bold;
  color: ${colors.text};
  line-height: 1.1;

  &:not(:first-of-type) {
    border-top: 1px solid #e4e8eb;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid #e4e8eb;
  }
`;

const ContentSelector = ({
  data,
  updateSelectedAnswers,
  selectedAnswers,
  selectedAnswerType,
  ...otherProps
}) => {
  const onEnterUp = (event, item) => {
    const code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      updateSelectedAnswers(item);
    }
  };
  const selectedAnswerIds = selectedAnswers.map(ans => ans.id);
  return data.map(section => (
    <div key={section.id}>
      <SectionTitle>{section.displayName}</SectionTitle>
      <MenuItemList>
        {section.pages.map(page =>
          page.answers.map(item => {
            const disabled =
              selectedAnswerType && selectedAnswerType !== item.type;
            return (
              <SubMenuItem
                key={item.id}
                aria-selected={selectedAnswerIds.indexOf(item.id) !== -1}
                onClick={() => updateSelectedAnswers(item)}
                disabled={disabled}
                tabIndex={disabled ? undefined : "0"}
                onKeyUp={event => (disabled ? null : onEnterUp(event, item))}
                {...otherProps}
              >
                <MenuItemTitles>
                  <MenuItemTitle>
                    <Truncated>{item.displayName}</Truncated>
                  </MenuItemTitle>
                  <MenuItemSubtitle>
                    <Truncated>{page.displayName}</Truncated>
                  </MenuItemSubtitle>
                </MenuItemTitles>
                <MenuItemType>{item.type}</MenuItemType>
              </SubMenuItem>
            );
          })
        )}
      </MenuItemList>
    </div>
  ));
};

ContentSelector.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
  updateSelectedAnswers: PropTypes.func.isRequired,
  selectedSummaryAnswers: PropTypes.arrayOf(
    PropTypes.shape(CustomPropTypes.answers)
  ),
  startingSelectedType: PropTypes.string,
};

export default ContentSelector;
