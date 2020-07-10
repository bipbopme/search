import { useState } from 'react';
import Router from 'next/router';
import axios from 'axios';
import debounce from 'lodash/debounce';

const KEY_CODES = {
  DOWN: 40,
  ENTER: 13,
  ESC: 27,
  UP: 38
};

export default function SearchBox({ q, placeholder }) {
  const inputRef = React.createRef();
  const [query, setQuery] = useState(q);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState();

  function revertToUserInput() {
    setQuery(userInput);
    setSelectedSuggestionIndex(-1);
  }

  function resetSuggestions() {
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
    setShowSuggestions(false);
  }

  function selectSuggestion(index) {
    setSelectedSuggestionIndex(index);
    setQuery(suggestions[index]);
  }

  async function handleChange(e) {
    const q = e.target.value;

    setQuery(q);
    setUserInput(q);
    setShowSuggestions(true);

    // Only fetch suggestions when there's a query
    if (q.length) {
      const response = await axios('/api/suggestions', { params: { q } });

      // TODO: Only update the suggestions if the query still matches
      setSuggestions(response.data[1]);
    }
    // Reset suggestions if there's no query
    else {
      setSuggestions([]);
    }
  }

  function handleKeyDown(e) {
    if (query?.length) {
      // Up arrow: decrement the index
      if (e.keyCode === KEY_CODES.UP) {
        // Don't move cursor to the beginning of the text
        e.preventDefault();

        // Wrap around to the end
        if (selectedSuggestionIndex === -1) {
          selectSuggestion(suggestions.length - 1);
        }
        // Select the input box
        else if (selectedSuggestionIndex === 0) {
          revertToUserInput();
        } else {
          selectSuggestion(selectedSuggestionIndex - 1);
        }
      }
      // Down arrow: increment the index
      else if (e.keyCode === KEY_CODES.DOWN) {
        // Don't move cursor to the end of the text
        e.preventDefault();

        // Select in the input box
        if (selectedSuggestionIndex === suggestions.length - 1) {
          revertToUserInput();
        } else {
          selectSuggestion(selectedSuggestionIndex + 1);
        }
      }
      // Esc: reset values
      else if (e.keyCode === KEY_CODES.ESC) {
        revertToUserInput();
      }
    }
  }

  function handleClick(e) {
    const q = e.currentTarget.innerText;

    setQuery(q);
    setUserInput(q);

    pushRoute(q);
  }

  function handleSubmit(e) {
    e.preventDefault();

    inputRef.current.blur();

    pushRoute(query);
  }

  function pushRoute(q) {
    resetSuggestions();

    Router.push({ pathname: '/search', query: { q: q } });
  }

  let suggestionsComponent;

  if (query?.length && suggestions.length) {
    suggestionsComponent = (
      <ul className="suggestions">
        {suggestions.map((suggestion, index) => {
          let className;

          // Flag the active suggestion with a class
          if (index === selectedSuggestionIndex) {
            className = 'selected';
          }

          return (
            <li className={className} key={suggestion} onClick={handleClick}>
              {suggestion}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <form className="searchBox" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={query}
      />
      <button type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
        </svg>
      </button>
      {suggestionsComponent}
    </form>
  );
}
