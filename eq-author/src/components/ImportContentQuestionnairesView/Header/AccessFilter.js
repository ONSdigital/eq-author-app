import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { colors } from "constants/theme";
import VisuallyHidden from "components/VisuallyHidden";

const Fieldset = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.textLight};
  margin: auto;
  position: absolute;
  width: 7.8em;
  left: 0;
  right: 0;
`;

const Buttons = styled.div`
  display: flex;
`;

const FilterButton = styled.label`
  background: white;
  padding: ${(props) =>
    props.paddingType === "large" ? "0.5rem 1rem" : "0.4rem 1rem"};
  font-size: 0.9em;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid ${colors.bordersLight};
  text-align: center;
  position: relative;
  white-space: nowrap;

  &:first-of-type {
    border-radius: 4px 0 0 4px;
    margin-right: -1px;
  }

  &:last-of-type {
    border-radius: 0 4px 4px 0;
  }

  &:hover {
    background: ${colors.lightMediumGrey};
  }

  &:focus-within {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }

  ${(props) =>
    props.checked &&
    css`
      color: white;
      background: ${colors.primary};
      border-color: #2d5e7a;
      z-index: 1;

      &:hover {
        background: ${colors.secondary};
      }
    `}
`;

const AccessFilter = ({ isFiltered, onToggleFilter, paddingType }) => {
  return (
    <Fieldset role="group">
      <Buttons>
        <FilterButton checked={!isFiltered} paddingType={paddingType}>
          All
          <VisuallyHidden>
            <input
              type="radio"
              name="filter"
              onChange={() => onToggleFilter(false)}
              checked={!isFiltered}
            />
          </VisuallyHidden>
        </FilterButton>
        <FilterButton checked={isFiltered} paddingType={paddingType}>
          Editor
          <VisuallyHidden>
            <input
              type="radio"
              name="filter"
              onChange={() => onToggleFilter(true)}
              checked={isFiltered}
            />
          </VisuallyHidden>
        </FilterButton>
      </Buttons>
    </Fieldset>
  );
};

AccessFilter.propTypes = {
  onToggleFilter: PropTypes.func.isRequired,
  isFiltered: PropTypes.bool.isRequired,
  paddingType: PropTypes.string,
};

export default AccessFilter;
