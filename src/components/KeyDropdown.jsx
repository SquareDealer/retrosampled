import React, { useState, useRef, useEffect } from 'react';

const KeyDropdown = ({ options, selectedKeys, onChange }) => {
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

  const toggleKey = (key) => {
    if (selectedKeys.includes(key)) {
      onChange(selectedKeys.filter((k) => k !== key));
    } else {
      onChange([...selectedKeys, key]);
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
            {selectedKeys.length > 0 ? `Key (${selectedKeys.length})` : 'Key'}
        </span>
        <img className="filters__dropdown-icon" src="/img/dropdown.png" alt="dropdown" />
      </button>

      {isOpen && (
        <div className="filters__dropdown-menu">
          {options.map((keyOption) => (
            <div 
              key={keyOption} 
              className={`filters__dropdown-item ${selectedKeys.includes(keyOption) ? 'filters__dropdown-item--selected' : ''}`}
              onClick={() => toggleKey(keyOption)}
            >
              {keyOption}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeyDropdown;
