package com.familiasunidas.familias_unidas.controller;

import com.familiasunidas.familias_unidas.dto.PersonDTO;
import com.familiasunidas.familias_unidas.model.Person;
import com.familiasunidas.familias_unidas.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/person")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    // Get all persons
    @GetMapping
    public List<PersonDTO> getAllPersons() {
        return personService.getAllPersons();
    }

    // Get a person by ID
    @GetMapping("/{id}")
    public ResponseEntity<PersonDTO> getPersonById(@PathVariable Long id) {
        return personService.getPersonById(id);
    }

    // Add a new person
    @PostMapping("/addPerson")
    public PersonDTO addPerson(@RequestBody Person person) {
        return personService.addPerson(person);
    }

    // Update a person by ID
    @PutMapping("/{id}")
    public ResponseEntity<PersonDTO> updatePerson(@PathVariable Long id, @RequestBody Person updatedPerson) {
        return personService.updatePerson(id, updatedPerson);
    }

    // Delete a person by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable Long id) {
        personService.deletePerson(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<PersonDTO> searchPersons(@RequestParam String name) {
        return personService.searchByName(name);
    }
}
