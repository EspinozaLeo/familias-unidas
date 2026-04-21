package com.familiasunidas.familias_unidas.service;

import com.familiasunidas.familias_unidas.dto.FamilyMemberDTO;
import com.familiasunidas.familias_unidas.model.FamilyMember;
import com.familiasunidas.familias_unidas.model.Person;
import com.familiasunidas.familias_unidas.repository.FamilyMemberRepository;
import com.familiasunidas.familias_unidas.repository.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FamilyMemberService {

    private final FamilyMemberRepository familyMemberRepository;
    private final PersonRepository personRepository;

    @Autowired
    public FamilyMemberService(FamilyMemberRepository familyMemberRepository, PersonRepository personRepository) {
        this.familyMemberRepository = familyMemberRepository;
        this.personRepository = personRepository;
    }

    public List<FamilyMemberDTO> getAllFamilyMembers() {
        return familyMemberRepository.findAll().stream()
                .map(FamilyMemberDTO::new)
                .collect(Collectors.toList());
    }

    public ResponseEntity<FamilyMemberDTO> getfamilyMemberById(Long id) {
        // if does not exist, throw appropriate error
        Optional<FamilyMember> famMember = familyMemberRepository.findById(id);
        return famMember.map(value -> ResponseEntity.ok(convertToDto(value)))
                .orElse(ResponseEntity.notFound().build());
    }

    public FamilyMemberDTO addFamilyMember(FamilyMember familyMember) {
        // what if family member already exists when trying to add them?
        FamilyMember savedFamMember = familyMemberRepository.save(familyMember);
        return convertToDto(savedFamMember);
    }

//    public ResponseEntity<FamilyMemberDTO> updateFamilyMember(Long id, FamilyMember updatedFamMember) {
//        return familyMemberRepository.findById(id)
//                .map(familyMember -> {
//                    familyMember.setfName(updatedFamMember.getfName());
//                    familyMember.setmName(updatedFamMember.getmName());
//                    familyMember.setlName(updatedFamMember.getlName());
//                    familyMember.setDob(updatedFamMember.getDob());
//                    familyMember.setMarried(updatedFamMember.isMarried());
//                    familyMember.setCovered(updatedFamMember.isCovered());
//                    familyMember.setRelationship(updatedFamMember.getRelationship());
//                    familyMemberRepository.save(familyMember);
//                    return ResponseEntity.ok(convertToDto(familyMember));
//                })
//                .orElse(ResponseEntity.notFound().build());
//    }

    // Passing id in the payload is mandatory to keep Person-FamilyMember
    // relationship otherwise it disassociates
    @Transactional
    public ResponseEntity<FamilyMemberDTO> updateFamilyMember(Long id, FamilyMemberDTO updatedFamMemberDto) {
        //maybe modify the if else here
        return familyMemberRepository.findById(id)
                .map(familyMember -> {
                    familyMember.setfName(updatedFamMemberDto.getfName());
                    familyMember.setmName(updatedFamMemberDto.getmName());
                    familyMember.setlName(updatedFamMemberDto.getlName());
                    familyMember.setDob(updatedFamMemberDto.getDob());
                    familyMember.setMarried(updatedFamMemberDto.isMarried());
                    familyMember.setCovered(updatedFamMemberDto.isCovered());
                    familyMember.setRelationship(updatedFamMemberDto.getRelationship());

                    // Handle the headOfFamily association using headOfFamilyId from DTO
                    if (updatedFamMemberDto.getHeadOfFamilyId() != null) {
                        Optional<Person> headOfFamily = personRepository.findById(updatedFamMemberDto.getHeadOfFamilyId());
                        headOfFamily.ifPresent(familyMember::setHeadOfFamily);
                    } else {
                        familyMember.setHeadOfFamily(null); // Set to null if no headOfFamilyId is provided
                    }

                    familyMemberRepository.save(familyMember);
                    return ResponseEntity.ok(new FamilyMemberDTO(familyMember));
                })
                .orElse(ResponseEntity.notFound().build());
    }

//    @Transactional
//    public void deleteFamilyMember(Long id) {
//        // add check for id
//        // if exists, continue to delete
//        // if does not exist, throw appropriate error
//        System.out.println("Attempting to delete family member with ID: " + id);
//        familyMemberRepository.deleteById(id);
//    }

    @Transactional
    public void deleteFamilyMember(Long id) {
        familyMemberRepository.deleteFamilyMemberById(id);
    }

    // helper function
    private FamilyMemberDTO convertToDto(FamilyMember familyMember) {
        FamilyMemberDTO dto = new FamilyMemberDTO();
        dto.setId(familyMember.getId());
        dto.setfName(familyMember.getfName());
        dto.setmName(familyMember.getmName());
        dto.setlName(familyMember.getlName());
        dto.setDob(familyMember.getDob());
        dto.setRelationship(familyMember.getRelationship());
        if (familyMember.getHeadOfFamily() != null) {
            dto.setHeadOfFamilyId(familyMember.getHeadOfFamily().getId());
        } else {
            dto.setHeadOfFamilyId(null);
        }
        dto.setCovered(familyMember.isCovered());
        dto.setMarried(familyMember.isMarried());
        return dto;
    }
}
