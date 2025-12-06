import React, { useState, useRef, useEffect } from 'react';

const BpmDropdown = ({ minBpm, maxBpm, onChange }) => {
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

  const handleMinChange = (e) => {
    onChange(e.target.value, maxBpm);
  };

  const handleMaxChange = (e) => {
    onChange(minBpm, e.target.value);
  };

  const displayText = (minBpm || maxBpm) 
    ? `BPM ${minBpm || '0'}-${maxBpm || '∞'}` 
    : 'BPM';

  return (
    <div className="filters__dropdown-wrapper" ref={dropdownRef}>
      <button 
        className={`filters__dropdown ${isOpen ? 'filters__dropdown--active' : ''}`} 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="filters__dropdown-text">{displayText}</span>
        <img className="filters__dropdown-icon" src="/img/dropdown.png" alt="dropdown" />
      </button>

      {isOpen && (
        <div className="filters__dropdown-menu filters__dropdown-menu--bpm">
          <div className="filters__bpm-inputs">
            <input 
                type="number" 
                className="filters__bpm-input" 
                placeholder="From" 
                value={minBpm} 
                onChange={handleMinChange}
            />
            <span className="filters__bpm-separator">-</span>
            <input 
                type="number" 
                className="filters__bpm-input" 
                placeholder="To" 
                value={maxBpm} 
                onChange={handleMaxChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BpmDropdown;
