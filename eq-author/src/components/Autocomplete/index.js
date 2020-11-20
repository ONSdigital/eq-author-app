/*
Need to do tomorrow:
[ ] - add enter/space functionality
[ ] - add saving of selected option
[ ] - finish accessibility
[X] - add switch case keys as object text
*/

import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

import {
  RoundedInput as Input,
  DropDown,
  ListItem,
  Wrapper,
} from "./index.style";
import ScrollPane from "components/ScrollPane";

import { isPrintableKeyCode } from "utils/isPrintableKeyCode";

const focusEl = element => {
  element.scrollIntoView();
  element.focus();
};

const keyCodes = {
  ArrowDown: "ArrowDown",
  ArrowUp: "ArrowUp",
  Enter: "Enter",
  Space: " ",
};

const AutocompleteProps = {
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  filter: PropTypes.func,
};

const Autocomplete = ({ options, filter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // need another state here for the selected option
  // not sure if this is needed now because I'm using Query instead
  // const [selectedOption, setSelectedOption] = useState(null);

  // builds a list of elements
  const comboElements = useRef({});

  const onArrowDown = useCallback(
    event => {
      event.preventDefault();

      const index =
        selectedIndex === filterOptions.length - 1 ? 0 : selectedIndex + 1;

      focusEl(comboElements.current[index]);
      setSelectedIndex(index);
    },
    [selectedIndex]
  );

  const onArrowUp = useCallback(
    event => {
      event.preventDefault();

      const index =
        selectedIndex === 0 ? filterOptions.length - 1 : selectedIndex - 1;
      focusEl(comboElements.current[index]);
      setSelectedIndex(index);
    },
    [selectedIndex]
  );

  const onSelect = useCallback(() => {
    const selectedValue = comboElements.current[selectedIndex].innerText;
    setQuery(selectedValue);
    setIsOpen(false);
  }, [selectedIndex]);

  const handleClick = useCallback(
    event => {
      event.preventDefault();
      setQuery(event.currentTarget.innerText);
      setIsOpen(false);
    },
    [selectedIndex]
  );

  const handleSelect = useCallback(
    event => {
      event.preventDefault();
      onSelect();
    },
    [selectedIndex]
  );

  const handleOtherKeyDown = useCallback(event => {
    const inputElement = comboElements.current[-1];
    const eventIsOnInput = event.target === inputElement;
    if (!eventIsOnInput) {
      inputElement.focus();
    }
  }, []);

  const handleKeyDown = event => {
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
          handleSelect(event);
          break;
        // space needs some work
        case Space:
          handleSelect(event);
          break;

        default:
          // this is needed to return the focus back to the input
          if (isPrintableKeyCode(event.keyCode)) {
            handleOtherKeyDown(event);
          }
          break;
      }
    }
  };

  const handleInputChange = useCallback(
    event => {
      setQuery(event.value);
      setSelectedIndex(-1);
    },
    // just setQuery is faster than setSelectedIndex
    [setQuery]
  );

  const filterOptions =
    typeof filter === "function" ? filter(options, query) : options;

  useEffect(() => {
    if (!isOpen && query.length) {
      setIsOpen(true);
    }
    if (isOpen && query.length) {
      setIsOpen(false);
    }
  }, [query]);

  const autoRender = (id, phase, actualTime, baseTime) => {
    console.log(id, phase, actualTime, baseTime);
  };

  return (
    <React.Profiler id="autocomplete" onRender={autoRender}>
      <Wrapper onKeyDown={event => handleKeyDown(event, isOpen)}>
        <Input
          id="autocomplete-input"
          // aria-activedescendant={isOpen ? comboElements.current[selectedIndex] : false}
          // aria-autocomplete={"list"}
          // aria-controls={"autocomplete-listbox"}
          // aria-expanded={isOpen ? "true" : "false"}
          // aria-owns={"autocomplete-listbox"}
          autoComplete="off"
          value={query}
          onChange={event => handleInputChange(event)}
          placeholder={"type here"}
          forwardRef={inputEl => {
            comboElements.current[-1] = inputEl;
          }}
          role="combobox"
          type="text"
        />
        {/* needs to be greater than one otherwise it leaves a zero */}
        {/* {isOpen && filterOptions.length > 1 && ( */}
        {isOpen && (
          <DropDown id="autocomplete-listbox" role="listbox">
            <ScrollPane>
              {filterOptions.map((option, index) => {
                // implicit return when complete
                return (
                  <ListItem
                    key={index}
                    id={`autocomplete-option-${index}`}
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
                );
              })}
              {!filterOptions.length && (
                <ListItem>{`${isOpen}`}No results found</ListItem>
              )}
            </ScrollPane>
          </DropDown>
        )}
      </Wrapper>
    </React.Profiler>
  );
};

Autocomplete.propTypes = AutocompleteProps;

export { Autocomplete };
