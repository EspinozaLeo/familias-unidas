package com.familiasunidas.familias_unidas.service;

import com.familiasunidas.familias_unidas.dto.FamilyMemberDTO;
import com.familiasunidas.familias_unidas.dto.PersonDTO;
import com.familiasunidas.familias_unidas.model.FamilyMember;
import com.familiasunidas.familias_unidas.model.Person;
import com.familiasunidas.familias_unidas.repository.FamilyMemberRepository;
import com.familiasunidas.familias_unidas.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final FamilyMemberRepository familyMemberRepository;

    @Autowired
    public PersonService(PersonRepository personRepository, FamilyMemberRepository familyMemberRepository) {
        this.personRepository = personRepository;
        this.familyMemberRepository = familyMemberRepository;
    }

    public List<PersonDTO> getAllPersons() {
        return personRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ResponseEntity<PersonDTO> getPersonById(Long id) {
        Optional<Person> person = personRepository.findById(id);
        return person.map(value -> ResponseEntity.ok(convertToDto(value)))
                .orElse(ResponseEntity.notFound().build());
    }

    public PersonDTO addPerson(Person person) {
        // Save the main person first to get the generated ID
        Person savedPerson = personRepository.save(person);

        // Now link family members to this saved person
        for (FamilyMember member : savedPerson.getFamilyMembers()) {
            member.setHeadOfFamily(savedPerson); // Set the saved person as head of family
            familyMemberRepository.save(member);
        }

        // Convert the saved Person entity to a PersonDTO before returning
        return convertToDto(savedPerson);
    }

    public ResponseEntity<PersonDTO> updatePerson(Long id, Person updatedPerson) {
        return personRepository.findById(id)
                .map(person -> {
                    // Update basic fields of the person
                    person.setfName(updatedPerson.getfName());
                    person.setmName(updatedPerson.getmName());
                    person.setlName(updatedPerson.getlName());
                    person.setPhoneNum(updatedPerson.getPhoneNum());
                    person.setJoinedDate(updatedPerson.getJoinedDate());
                    person.setDob(updatedPerson.getDob());
                    person.setAddress(updatedPerson.getAddress());

                    // Clear out existing family members and update with new list
                    person.getFamilyMembers().clear();

                    // Add the family members from the updated person
                    for (FamilyMember member : updatedPerson.getFamilyMembers()) {
                        // If the member has an ID, find and update it, else add a new one
                        Optional<FamilyMember> existingMemberOpt = familyMemberRepository.findById(member.getId());

                        if (existingMemberOpt.isPresent()) {
                            // Update existing member
                            FamilyMember existingMember = existingMemberOpt.get();
                            existingMember.setfName(member.getfName());
                            existingMember.setmName(member.getmName());
                            existingMember.setlName(member.getlName());
                            existingMember.setDob(member.getDob());
                            existingMember.setMarried(member.isMarried());
                            existingMember.setCovered(member.isCovered());
                            existingMember.setRelationship(member.getRelationship());
                            familyMemberRepository.save(existingMember);

                            // Add to person's list
                            person.getFamilyMembers().add(existingMember);
                        } else {
                            // Add new family member if ID is not present
                            member.setHeadOfFamily(person);
                            familyMemberRepository.save(member);
                            person.getFamilyMembers().add(member);
                        }
                    }

                    // Save the updated person and return the DTO
                    personRepository.save(person);
                    return ResponseEntity.ok(convertToDto(person));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public void deletePerson(Long id) {
        personRepository.deleteById(id);
    }

    public List<PersonDTO> searchByName(String name) {
        List<Person> persons = personRepository.searchByName(name);
        return persons.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // Converts a Person entity to a PersonDTO
    private PersonDTO convertToDto(Person person) {
        PersonDTO dto = new PersonDTO();
        dto.setId(person.getId());
        dto.setfName(person.getfName());
        dto.setmName(person.getmName());
        dto.setlName(person.getlName());
        dto.setPhoneNum(person.getPhoneNum());
        dto.setJoinedDate(person.getJoinedDate());
        dto.setDob(person.getDob());
        dto.setAddress(person.getAddress());
        dto.setFamilyMembers(
                person.getFamilyMembers().stream()
                        .map(FamilyMemberDTO::new)  // Assuming FamilyMemberDTO has a constructor that takes a FamilyMember
                        .collect(Collectors.toList())
        );
        return dto;
    }

}
