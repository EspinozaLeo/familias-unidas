package com.familiasunidas.familias_unidas.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table
public class FamilyMember {
    @Id
    @SequenceGenerator(
            name = "family_member_sequence",
            sequenceName = "family_member_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "family_member_sequence"
    )
    private Long id;

    private String fName;
    private String mName;
    private String lName;
    private LocalDate dob;
    @Column(name = "is_married")
    @JsonProperty("isMarried")
    private boolean isMarried;
    @Column(name = "is_covered")
    @JsonProperty("isCovered")
    private boolean isCovered;
    private String relationship;


    // @ManyToOne(fetch = FetchType.LAZY) this one will not load Person. FetchType.EAGE will load Person
    // We use FetchType.LAZY to be able to DELETE a familyMember if not using the repository query
    // function deleteFamilyMemberById(@Param("id") Long id)
    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person headOfFamily; // The Person the family member is tied to

    public FamilyMember() {
    }

    public FamilyMember(Long id, String fName, String mName, String lName, LocalDate dob, boolean isMarried, boolean isCovered, String relationship, Person headOfFamily) {
        this.id = id;
        this.fName = fName;
        this.mName = mName;
        this.lName = lName;
        this.dob = dob;
        this.isMarried = isMarried;
        this.isCovered = isCovered;
        this.relationship = relationship;
        this.headOfFamily = headOfFamily;
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

    public Person getHeadOfFamily() {
        return headOfFamily;
    }

    public void setHeadOfFamily(Person headOfFamily) {
        this.headOfFamily = headOfFamily;
    }
}
