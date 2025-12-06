import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="filters__search-wrapper">
        <input 
            className="filters__search-input" 
            type="text" 
            placeholder="Search by keyword" 
            onChange={(e) => onSearch(e.target.value)}
        />
        <img className="filters__search-icon" src="/img/search.png" alt="search" />
    </div>
  );
};

export default SearchBar;
