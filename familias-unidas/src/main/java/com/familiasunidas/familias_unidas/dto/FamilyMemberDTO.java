package com.familiasunidas.familias_unidas.dto;

import com.familiasunidas.familias_unidas.model.FamilyMember;

import java.time.LocalDate;

public class FamilyMemberDTO {
    private Long id;
    private String fName;
    private String mName;
    private String lName;
    private LocalDate dob;
    private boolean isMarried;
    private boolean isCovered;
    private String relationship;
    private Long headOfFamilyId;

    public FamilyMemberDTO() {

    }

    public FamilyMemberDTO(FamilyMember member) {
        this.id = member.getId();
        this.fName = member.getfName();
        this.mName = member.getmName();
        this.lName = member.getlName();
        this.dob = member.getDob();
        this.isMarried = member.isMarried();
        this.isCovered = member.isCovered();
        this.relationship = member.getRelationship();
        this.headOfFamilyId = member.getHeadOfFamily() != null ? member.getHeadOfFamily().getId() : null;
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

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public boolean isMarried() {
        return isMarried;
    }

    public void setMarried(boolean married) {
        isMarried = married;
    }

    public boolean isCovered() {
        return isCovered;
    }

    public void setCovered(boolean covered) {
        isCovered = covered;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public Long getHeadOfFamilyId() {
        return headOfFamilyId;
    }

    public void setHeadOfFamilyId(Long headOfFamilyId) {
        this.headOfFamilyId = headOfFamilyId;
    }
}

