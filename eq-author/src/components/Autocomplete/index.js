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

const focusEl = (element) => element && element.focus();

const AutocompleteProps = {
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  updateOption: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  filter: PropTypes.func,
  placeholder: PropTypes.string,
  hasError: PropTypes.bool,
  borderless: PropTypes.bool,
  className: PropTypes.string,
};

const Autocomplete = ({
  options,
  updateOption,
  defaultValue,
  filter,
  placeholder,
  hasError,
  borderless = false,
  className,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState(defaultValue || null);
  const [isOpen, setIsOpen] = useState(false);
  // builds a list of elements
  const comboElements = useRef(new Map());

  // any filter function added needs to accept query as a param and return an array
  const [filterOptions, categories] = React.useMemo(
    () =>
      filter && typeof filter === "function"
        ? filter(options, query)
        : [options.filter((option) => option.toLowerCase().includes(query))],
    [query, options, filter]
  );

  // Allow dynamically modifying the selected value from parent component
  useEffect(() => {
    setSelectedOption(defaultValue);
    setIsOpen(false);
  }, [defaultValue]);

  const onArrowDown = useCallback(
    (event) => {
      event.preventDefault();
      const isLarger = (categories && categories.length) > filterOptions.length;

      const arrayLength = isLarger ? categories.length : filterOptions.length;

      const increaseIndex =
        selectedIndex === arrayLength - 1 ? arrayLength - 1 : selectedIndex + 1;

      const hasIndex =
        comboElements.current.has(increaseIndex) &&
        comboElements.current.get(increaseIndex) !== null;

      const index = hasIndex ? increaseIndex : increaseIndex + 1;

      focusEl(comboElements.current.get(index));
      setSelectedIndex(index);
    },
    [selectedIndex, categories, filterOptions.length]
  );

  const onArrowUp = useCallback(
    (event) => {
      event.preventDefault();

      const decreaseIndex = selectedIndex === -1 ? -1 : selectedIndex - 1;

      const hasIndex =
        comboElements.current.has(decreaseIndex) &&
        comboElements.current.get(decreaseIndex) !== null;

      const index = hasIndex ? decreaseIndex : decreaseIndex - 1;

      focusEl(comboElements.current.get(index));
      setSelectedIndex(index);
    },
    [selectedIndex]
  );

  const onSelect = useCallback(() => {
    const selectedElement = comboElements.current.get(selectedIndex);
    setSelectedOption(selectedElement.innerText);
    updateOption(selectedElement);
  }, [selectedIndex, updateOption]);

  const handleSelect = useCallback(
    (event) => {
      event.preventDefault();

      onSelect();
    },
    [onSelect]
  );

  const handleInputChange = useCallback(
    (event) => {
      setQuery(event.value);

      if (selectedOption) {
        setSelectedOption(null);
      }
    },
    [setQuery, selectedOption]
  );

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      const clickedElement = event.currentTarget;
      setSelectedOption(clickedElement.innerText);
      updateOption(clickedElement);
      setQuery("");
    },
    [updateOption]
  );

  const handleOtherKeyDown = useCallback((event) => {
    const inputElement = comboElements.current.get(-1);
    const eventIsOnInput = event.target === inputElement;
    if (!eventIsOnInput) {
      // this resets list back to top
      // check with Joe if this is okay
      comboElements.current.has(1) && comboElements.current.get(1).focus();
      inputElement.focus();
    }
  }, []);

  const handleBlur = useCallback(
    (e) => {
      e.stopPropagation();
      if (!e.currentTarget.contains(e.relatedTarget)) {
        if (selectedOption === null) {
          setQuery("");
          updateOption("");
        }
        setIsOpen(false);
      }
    },
    [selectedOption, updateOption]
  );

  const handleKeyDown = useCallback(
    (event) => {
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
    [
      selectedIndex,
      isOpen,
      handleOtherKeyDown,
      handleSelect,
      onArrowDown,
      onArrowUp,
      filterOptions.length,
    ]
  );

  useEffect(
    () => {
      if (selectedIndex >= 0) {
        setSelectedIndex(-1);
      }
    },
    // eslint-disable-next-line
    [query, isOpen, selectedOption]
  );

  // ------------------------------------------------------
  // provides hint to screen reader when query is empty
  const assistiveHintID = "autocomplete-assistiveHint";
  const ariaDescribedProp = !query.length
    ? { "aria-describedby": assistiveHintID }
    : null;
  const tAssistiveHint = () =>
    "When autocomplete results are available use up and down arrows to review and enter to select.";
  // ------------------------------------------------------

  const results = React.useMemo(
    () =>
      (categories || filterOptions).map((option, index) => {
        if (option.props?.category) {
          return (
            <ListItem
              key={index}
              id={`autocomplete-category-${index}`}
              data-test={`autocomplete-category-${index}`}
              tabIndex="-1"
              category
            >
              {option}
            </ListItem>
          );
        }
        return (
          <ListItem
            key={index}
            id={`autocomplete-option-${index}`}
            data-test={`autocomplete-option-${index}`}
            aria-selected={selectedIndex === index ? "true" : "false"}
            tabIndex="-1"
            role="option"
            ref={(optionEl) => {
              comboElements.current.set(index, optionEl);
            }}
            onClick={(event) => handleClick(event)}
          >
            {option}
          </ListItem>
        );
      }),
    [filterOptions, categories, handleClick, selectedIndex]
  );

  return (
    <>
      <Wrapper
        data-test="autocomplete"
        onKeyDown={(event) => handleKeyDown(event)}
        onBlur={(e) => handleBlur(e)}
        onClick={() => setIsOpen(true)}
        className={className}
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
              ? comboElements.current.get(selectedIndex)?.id
              : `${false}`
          }
          aria-autocomplete={"list"}
          aria-controls={"autocomplete-listbox"}
          {...ariaDescribedProp}
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Auto complete input"
          aria-owns={"autocomplete-listbox"}
          autoComplete="off"
          forwardRef={(inputEl) => {
            comboElements.current.set(-1, inputEl);
          }}
          onChange={(event) => handleInputChange(event)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          role="combobox"
          type="text"
          value={selectedOption ? selectedOption : query}
          hasError={hasError}
          borderless={borderless}
        />
        {isOpen && !selectedOption && (
          <DropDown
            id="autocomplete-listbox"
            data-test="autocomplete-listbox"
            role="listbox"
          >
            {results}
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

export { Autocomplete, AutocompleteProps };
