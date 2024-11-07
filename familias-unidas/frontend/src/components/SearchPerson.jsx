// src/components/SearchPerson.jsx
import React, { useContext, useState } from 'react';
import { PersonContext } from '../context/PersonContext';

const SearchPerson = () => {
  const { persons } = useContext(PersonContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPersons, setFilteredPersons] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === '') {
      setFilteredPersons([]); // Clear results when search query is empty
    } else {
      const results = persons.filter(person =>
        person.fName.toLowerCase().includes(query.toLowerCase()) ||
        person.mName.toLowerCase().includes(query.toLowerCase()) ||
        person.lName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPersons(results);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for a person..."
      />

      <div>
        {filteredPersons.length > 0 ? (
          <ul>
            {filteredPersons.map((person) => (
              <li key={person.id}>
                {person.fName} {person.mName} {person.lName}
              </li>
            ))}
          </ul>
        ) : (
          searchQuery && <p>No results found.</p> // Show "No results found" only if there was a search query
        )}
      </div>
    </div>
  );
};

export default SearchPerson;
