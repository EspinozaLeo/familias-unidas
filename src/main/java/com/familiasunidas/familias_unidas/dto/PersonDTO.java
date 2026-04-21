package com.familiasunidas.familias_unidas.dto;

import com.familiasunidas.familias_unidas.model.Address;

import java.time.LocalDate;
import java.util.List;

public class PersonDTO {
    private Long id;
    private String fName;
    private String mName;
    private String lName;
    private String phoneNum;
    private LocalDate joinedDate;
    private LocalDate dob;
    private Address address;
    private List<FamilyMemberDTO> familyMembers;

    public PersonDTO() {
    }

    public PersonDTO(Long id, String fName, String mName, String lName, String phoneNum, LocalDate joinedDate, LocalDate dob, Address address, List<FamilyMemberDTO> familyMembers) {
        this.id = id;
        this.fName = fName;
        this.mName = mName;
        this.lName = lName;
        this.phoneNum = phoneNum;
        this.joinedDate = joinedDate;
        this.dob = dob;
        this.address = address;
        this.familyMembers = familyMembers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getfName() {
        return fName;
    }

    public void setfName(String fName) {
        this.fName = fName;
    }

    public String getmName() {
        return mName;
    }

    public void setmName(String mName) {
        this.mName = mName;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public LocalDate getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(LocalDate joinedDate) {
        this.joinedDate = joinedDate;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public List<FamilyMemberDTO> getFamilyMembers() {
        return familyMembers;
    }

    public void setFamilyMembers(List<FamilyMemberDTO> familyMembers) {
        this.familyMembers = familyMembers;
    }
}
