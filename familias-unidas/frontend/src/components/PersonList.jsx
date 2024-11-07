import React, { useEffect, useState } from 'react';
import { getAllPersons } from '../services/personService';

const PersonList = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const fetchPersons = async () => {
      const data = await getAllPersons();
      setPersons(data);
    };
    fetchPersons();
  }, []);

  return (
    <div>
      <h1>Person List</h1>
      <ul>
        {persons.map(person => (
          <li key={person.id}>
            {person.fName} {person.mName} {person.lName} - {person.phoneNum}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonList;