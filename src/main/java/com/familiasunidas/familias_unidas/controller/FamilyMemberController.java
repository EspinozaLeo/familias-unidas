package com.familiasunidas.familias_unidas.controller;

import com.familiasunidas.familias_unidas.dto.FamilyMemberDTO;
import com.familiasunidas.familias_unidas.model.FamilyMember;
import com.familiasunidas.familias_unidas.service.FamilyMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/familymembers")
public class FamilyMemberController {

    private final FamilyMemberService familyMemberService;

    @Autowired
    public FamilyMemberController(FamilyMemberService familyMemberService) {
        this.familyMemberService = familyMemberService;
    }

    @GetMapping
    public List<FamilyMemberDTO> getAllFamilyMembers() {
        return familyMemberService.getAllFamilyMembers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FamilyMemberDTO> getFamilyMemberById(@PathVariable Long id) {
        return familyMemberService.getfamilyMemberById(id);
    }

    // Add a new familyMember
    @PostMapping("/addFamilyMember")
    public FamilyMemberDTO addFamilyMember(@RequestBody FamilyMember familyMember) {
        return familyMemberService.addFamilyMember(familyMember);
    }

    // Update a FamilyMember by ID
    @PutMapping("/{id}")
    public ResponseEntity<FamilyMemberDTO> updateFamilyMember(@PathVariable Long id, @RequestBody FamilyMemberDTO updatedFamMember) {
        return  familyMemberService.updateFamilyMember(id, updatedFamMember);
    }

    // Delete a FamilyMember by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFamilyMember(@PathVariable Long id) {
        familyMemberService.deleteFamilyMember(id);
        return ResponseEntity.noContent().build();
    }
}
