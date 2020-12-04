import React, { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { Status } from "./SRStatus";

import {
  RoundedInput as Input,
  DropDown,
  ListItem,
  Wrapper,
} from "./index.style";

import { keyCodes } from "constants/keyCodes";
import { isPrintableKeyCode } from "utils/isPrintableKeyCode";

const focusEl = element => element && element.focus();

const AutocompleteProps = {
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  updateOption: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
  filter: PropTypes.func,
  placeholder: PropTypes.string,
  hasError: PropTypes.bool,
};

const Autocomplete = ({
  options,
  updateOption,
  defaultValue,
  filter,
  placeholder,
  hasError,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState(defaultValue || null);
  const [isOpen, setIsOpen] = useState(false);
  // builds a list of elements
  const comboElements = useRef({});

  const onArrowDown = useCallback(
    event => {
      event.preventDefault();
      const index =
        selectedIndex === filterOptions.length - 1
          ? filterOptions.length - 1
          : selectedIndex + 1;

      focusEl(comboElements.current[index]);
      setSelectedIndex(index);
    },
    [selectedIndex]
  );

  const onArrowUp = useCallback(
    event => {
      event.preventDefault();

      const index = selectedIndex === -1 ? -1 : selectedIndex - 1;

      focusEl(comboElements.current[index]);
      setSelectedIndex(index);
    },
    [selectedIndex]
  );

  const onSelect = useCallback(() => {
    const selectedElement = comboElements.current[selectedIndex];
    setSelectedOption(selectedElement.innerText);
    updateOption(selectedElement);
  }, [selectedIndex]);

  const handleSelect = useCallback(
    event => {
      event.preventDefault();

      onSelect();
    },
    [selectedIndex, isOpen]
  );

  const handleInputChange = useCallback(
    event => {
      setQuery(event.value);

      if (selectedOption) {
        setSelectedOption(null);
      }
    },
    [setQuery, selectedOption, isOpen]
  );

  const handleClick = useCallback(
    event => {
      event.preventDefault();
      const clickedElement = event.currentTarget;
      setSelectedOption(clickedElement.innerText);
      updateOption(clickedElement);
    },
    [selectedIndex, isOpen]
  );

  const handleOtherKeyDown = useCallback(
    event => {
      const inputElement = comboElements.current[-1];
      const eventIsOnInput = event.target === inputElement;
      if (!eventIsOnInput) {
        inputElement.focus();
      }
    },
    [isOpen]
  );

  const handleBlur = useCallback(
    e => {
      e.stopPropagation();
      if (!e.currentTarget.contains(e.relatedTarget)) {
        if (query.length === 0 && selectedOption !== null) {
          updateOption("");
        }
        setIsOpen(false);
      }
    },
    [query, isOpen]
  );

  const handleKeyDown = useCallback(
    event => {
      if (isOpen && filterOptions.length) {
        const { key } = event;
        const { ArrowDown, ArrowUp, Enter, Space } = keyCodes;

        switch (key) {
          case ArrowDown:
            onArrowDown(event);
            break;
          case ArrowUp:
            onArrowUp(event);
            break;
          case Enter:
            if (selectedIndex !== -1) {
              handleSelect(event);
            }
            break;
          case Space:
            if (selectedIndex !== -1) {
              handleSelect(event);
            }
            break;
          default:
            // this is needed to return the focus back to the input
            // (selected > -1) is focus index of list items
            if (isPrintableKeyCode(event.keyCode) && selectedIndex > -1) {
              handleOtherKeyDown(event);
            }
            break;
        }
      }
    },
    [query, selectedIndex, isOpen]
  );

  useEffect(() => {
    if (selectedIndex > -1) {
      setSelectedIndex(-1);
    }
  }, [query, isOpen, selectedOption]);

  // any filter function added needs to accept query as a param
  const filterOptions =
    typeof filter === "function"
      ? filter(options, query)
      : options.filter(option => option.toLowerCase().includes(query));

  // ------------------------------------------------------
  // provides hint to screen reader when query is empty
  const assistiveHintID = "autocomplete-assistiveHint";
  const ariaDescribedProp = !query.length
    ? { "aria-describedby": assistiveHintID }
    : null;
  const tAssistiveHint = () =>
    "When autocomplete results are available use up and down arrows to review and enter to select.";
  // ------------------------------------------------------

  return (
    <>
      <Wrapper
        data-test="autocomplete"
        onKeyDown={event => handleKeyDown(event)}
        onBlur={e => handleBlur(e)}
        onClick={() => setIsOpen(true)}
      >
        <Status
          id={"autocomplete-input-status"}
          length={filterOptions.length}
        />
        <Input
          id="autocomplete-input"
          data-test="autocomplete-input"
          aria-activedescendant={
            isOpen && query.length > 0
              ? comboElements.current[selectedIndex]?.id
              : `${false}`
          }
          aria-autocomplete={"list"}
          aria-controls={"autocomplete-listbox"}
          {...ariaDescribedProp}
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Auto complete input"
          aria-owns={"autocomplete-listbox"}
          autoComplete="off"
          forwardRef={inputEl => {
            comboElements.current[-1] = inputEl;
          }}
          onChange={event => handleInputChange(event)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          role="combobox"
          type="text"
          value={selectedOption ? selectedOption : query}
          hasError={hasError}
        />
        {isOpen && !selectedOption && (
          <DropDown
            id="autocomplete-listbox"
            data-test="autocomplete-listbox"
            role="listbox"
          >
            {filterOptions.map((option, index) => (
              <ListItem
                key={index}
                id={`autocomplete-option-${index}`}
                data-test={`autocomplete-option-${index}`}
                aria-selected={selectedIndex === index ? "true" : "false"}
                aria-setsize={filterOptions.length}
                aria-posinset={index + 1}
                tabIndex="-1"
                role="option"
                ref={optionEl => {
                  comboElements.current[index] = optionEl;
                }}
                onClick={event => handleClick(event)}
              >
                {option}
              </ListItem>
            ))}
            {!filterOptions.length && <ListItem>No results found</ListItem>}
          </DropDown>
        )}
      </Wrapper>
      <span id={assistiveHintID} style={{ display: "none" }}>
        {tAssistiveHint()}
      </span>
    </>
  );
};

Autocomplete.propTypes = AutocompleteProps;

export { Autocomplete };
