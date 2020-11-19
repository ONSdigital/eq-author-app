import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

import {
  RoundedInput as Input,
  DropDown,
  ListItem,
  Wrapper,
} from "./index.style";
import ScrollPane from "components/ScrollPane";

const AutocompleteProps = {
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  filter: PropTypes.func,
};

const Autocomplete = ({ options, filter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listEl = useRef({});

  const focusEl = element => {
    element.scrollIntoView();
    element.focus();
  };

  const onArrowDown = useCallback(
    event => {
      event.preventDefault();

      const index =
        selectedIndex === filterOptions.length - 1 ? 0 : selectedIndex + 1;

      focusEl(listEl.current[index]);
      setSelectedIndex(index);
    },
    [selectedIndex]
  );

  const onArrowUp = useCallback(
    event => {
      event.preventDefault();

      const index =
        selectedIndex === 0 ? filterOptions.length - 1 : selectedIndex - 1;

      focusEl(listEl.current[index]);
      setSelectedIndex(index);
    },
    [selectedIndex]
  );

  const onEnter = useCallback(event => {
    event.preventDefault();
    // do something here
  }, []);

  const onSpace = useCallback(event => {
    event.preventDefault();
    // do something here
  }, []);

  const handleKeyDown = event => {
    if (isOpen && filterOptions.length) {
      const { key } = event;

      switch (key) {
        case "ArrowDown":
          onArrowDown(event);
          break;
        case "ArrowUp":
          onArrowUp(event);
          break;
        case "Enter":
          onEnter(event);
          break;
        // space needs some work
        case "Space":
          onSpace(event);
          break;

        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (!isOpen && query.length) {
      setIsOpen(true);
    }
    if (isOpen && !query.length) {
      setIsOpen(false);
    }
  }, [query]);

  const handleInputChange = event => {
    setQuery(event.value);
    setSelectedIndex(-1);
  };

  const filterOptions =
    typeof filter === "function" ? filter(options, query) : options;

  return (
    <Wrapper onKeyDown={event => handleKeyDown(event, isOpen)}>
      <Input
        id=""
        aria-expanded={isOpen ? "true" : "false"}
        // aria-activedescendant={}
        // aria-owns={}
        value={query}
        onChange={event => handleInputChange(event)}
        // aria-autocomplete="list"
        // placeholder={"search something"}
        // role="combobox"
        // type="text"
      />
      {isOpen && (
        <DropDown role="listbox">
          <ScrollPane>
            {filterOptions.map((option, index) => {
              // const focus = selectedIndex === index;
              return (
                <ListItem
                  key={index}
                  ref={optionEl => {
                    listEl.current[index] = optionEl;
                  }}
                  // id={}
                  tabIndex="-1"
                  role="option"
                  // aria-selected={}
                  // aria-posinset={index + 1}
                  aria-setsize={filterOptions.length}
                >
                  {option}
                </ListItem>
              );
            })}
            {!filterOptions.length && <ListItem>No results found</ListItem>}
          </ScrollPane>
        </DropDown>
      )}
    </Wrapper>
  );
};

Autocomplete.propTypes = AutocompleteProps;

export { Autocomplete };
