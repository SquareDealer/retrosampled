import React, { useState, useRef, useEffect } from 'react';

const GenreDropdown = ({ options, selectedGenres, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="filters__dropdown-wrapper" ref={dropdownRef}>
      <button 
        className={`filters__dropdown ${isOpen ? 'filters__dropdown--active' : ''}`} 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="filters__dropdown-text">
            {selectedGenres.length > 0 ? `Genre (${selectedGenres.length})` : 'Genre'}
        </span>
        <img className="filters__dropdown-icon" src="/img/dropdown.png" alt="dropdown" />
      </button>

      {isOpen && (
        <div className="filters__dropdown-menu">
          {options.map((genre) => (
            <div 
              key={genre} 
              className={`filters__dropdown-item ${selectedGenres.includes(genre) ? 'filters__dropdown-item--selected' : ''}`}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreDropdown;
