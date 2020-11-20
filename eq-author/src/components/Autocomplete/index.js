/*
Need to do tomorrow:
[X] - add enter/space functionality
[X] - add saving of selected option
[X] - add switch case keys as object text
[ ] - finish accessibility
    - this is hard
    - turns out I don't know a lot
    - need to find a way to get rid of the repeating read out
    - would like the focus to work properly
*/

import React, { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";

import { Status } from "./SRStatus";

import {
  RoundedInput as Input,
  DropDown,
  ListItem,
  Wrapper,
} from "./index.style";
import ScrollPane from "components/ScrollPane";

import { keyCodes } from "constants/keyCodes";
import { isPrintableKeyCode } from "utils/isPrintableKeyCode";

const focusEl = element => {
  element.scrollIntoView();
  element.focus();
};

const AutocompleteProps = {
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  filter: PropTypes.func,
  placeholder: PropTypes.string,
};

const Autocomplete = ({ options, filter, placeholder }) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState(null);
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

    setSelectedOption(selectedValue);
  }, [selectedIndex]);

  const handleSelect = useCallback(
    event => {
      event.preventDefault();

      onSelect();
    },
    [selectedIndex]
  );

  const handleInputChange = useCallback(
    event => {
      setQuery(event.value);
      setSelectedIndex(-1);
      if (!selectedOption) {
        setSelectedOption(null);
      }
    },
    // just setQuery is faster than setSelectedIndex
    [setQuery]
  );

  const handleClick = useCallback(
    event => {
      event.preventDefault();

      setSelectedOption(event.currentTarget.innerText);
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

  const handleKeyDown = useCallback(
    event => {
      if (query.length > 0) {
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
    },
    [query, selectedIndex]
  );

  const filterOptions =
    typeof filter === "function" ? filter(options, query) : options;

  // using this to measure performance
  const autoRender = (id, phase, actualTime, baseTime) => {
    console.log(id, phase, actualTime, baseTime);
  };

  // ------------------------------------------------------
  // These use another span to describe what's going on
  const assistiveHintID = "autocomplete-assistiveHint";
  const ariaDescribedProp = { "aria-describedby": assistiveHintID };
  const tAssistiveHint = () =>
    "When autocomplete results are available use up and down arrows to review and enter to select.  Touch device users, explore by touch or with swipe gestures.";
  // ------------------------------------------------------
  return (
    <React.Profiler id="autocomplete" onRender={autoRender}>
      <Wrapper onKeyDown={event => handleKeyDown(event)}>
        {/* This is a work in progress */}
        <Status
          id={"autocomplete-input"}
          length={filterOptions.length}
          queryLength={query.length}
          isInFocus={selectedIndex}
          validChoiceMade={selectedOption}
          selectedOption={selectedOption}
          selectedOptionIndex={selectedIndex}
        />
        {/* This is a work in progress */}
        <Input
          id="autocomplete-input"
          aria-activedescendant={
            query.length > 0 ? comboElements.current[selectedIndex].id : false
          }
          aria-autocomplete={"list"}
          aria-controls={"autocomplete-listbox"}
          {...ariaDescribedProp}
          aria-expanded={query.length > 0 ? "true" : "false"}
          aria-owns={"autocomplete-listbox"}
          autoComplete="off"
          forwardRef={inputEl => {
            comboElements.current[-1] = inputEl;
          }}
          onChange={event => handleInputChange(event)}
          placeholder={placeholder}
          role="combobox"
          type="text"
          value={selectedOption ? selectedOption : query}
        />
        {query.length > 0 && !selectedOption && (
          <DropDown id="autocomplete-listbox" role="listbox">
            <ScrollPane>
              {filterOptions.map((option, index) => (
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
              ))}
              {!filterOptions.length && <ListItem>No results found</ListItem>}
            </ScrollPane>
          </DropDown>
        )}
      </Wrapper>
      {/* This is a wip */}
      <span id={assistiveHintID} style={{ display: "none" }}>
        {tAssistiveHint()}
      </span>
    </React.Profiler>
  );
};

Autocomplete.propTypes = AutocompleteProps;

export { Autocomplete };
