import React from 'react';
import Router from 'next/router';
import axios from 'axios';

const KEY_CODES = {
  DOWN: 40,
  ENTER: 13,
  ESC: 27,
  UP: 38
};

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    // Bind this
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      query: null,
      suggestions: [],
      selectedSuggestionIndex: -1,
      showSuggestions: false
    };
  }

  componentDidMount() {
    // The autofocus attribute doesn't work reliably therefore this...
    if (this.props.autoFocus) {
      this.inputRef.current.focus();
    }
  }

  revertToUserInput() {
    this.setState({ query: this.state.userInput, selectedSuggestionIndex: -1 });
  }

  reset() {
    this.setState({
      suggestions: [],
      selectedSuggestionIndex: -1,
      showSuggestions: false,
      query: null
    });
  }

  selectSuggestion(index) {
    this.setState({ selectedSuggestionIndex: index, query: this.state.suggestions[index] });
  }

  async handleChange(e) {
    const query = e.target.value;
    const userInput = query;

    // Start showing suggestions if they've been turned off
    this.setState({ showSuggestions: true });

    // Update query immediately
    this.setState({ query: query, userInput: userInput });

    // Only fetch suggestions when there's a query
    if (query.length) {
      // TODO: Debounce this request
      const response = await axios('/api/suggestions', {
        params: { q: query }
      });

      // Only update the suggestions if the query still matches
      if (this.state.showSuggestions && this.state.query === response.data[0]) {
        // Update suggestions
        this.setState({ suggestions: response.data[1] });
      }
    }
    // Reset suggestions if there's no query
    else {
      this.setState({ suggestions: [] });
    }
  }

  handleKeyDown(e) {
    let { suggestions, selectedSuggestionIndex, query } = this.state;

    if (query?.length) {
      // Up arrow: decrement the index
      if (e.keyCode === KEY_CODES.UP) {
        // Don't move cursor to the beginning of the text
        e.preventDefault();

        // Wrap around to the end
        if (selectedSuggestionIndex === -1) {
          this.selectSuggestion(suggestions.length - 1);
        }
        // Select the input box
        else if (selectedSuggestionIndex === 0) {
          this.revertToUserInput();
        } else {
          this.selectSuggestion(selectedSuggestionIndex - 1);
        }
      }
      // Down arrow: increment the index
      else if (e.keyCode === KEY_CODES.DOWN) {
        // Don't move cursor to the end of the text
        e.preventDefault();

        // Select in the input box
        if (selectedSuggestionIndex === suggestions.length - 1) {
          this.revertToUserInput();
        } else {
          this.selectSuggestion(selectedSuggestionIndex + 1);
        }
      }
      // Esc: reset values
      else if (e.keyCode === KEY_CODES.ESC) {
        this.revertToUserInput();
      }
    }
  }

  handleClick(e) {
    const query = e.currentTarget.innerText;

    this.setState({ query: query, userInput: query });

    this.pushRoute(query);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.inputRef.current.blur();

    this.pushRoute(this.state.query);
  }

  pushRoute(q) {
    this.reset();

    Router.push({ pathname: this.props.path || '/search', query: { q: q } });
  }

  render() {
    const { suggestions, selectedSuggestionIndex } = this.state;
    const query = this.state.query !== null ? this.state.query : this.props.query;

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
              <li className={className} key={suggestion} onClick={this.handleClick}>
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <form className="searchBox" onSubmit={this.handleSubmit}>
        <input
          ref={this.inputRef}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
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
}

export default SearchBox;
