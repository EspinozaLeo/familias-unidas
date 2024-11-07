package com.familiasunidas.familias_unidas.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table
public class Person {
    @Id
    @SequenceGenerator(
            name = "person_sequence",
            sequenceName = "person_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "person_sequence"
    )
    private Long id;

    private String fName;
    private String mName;
    private String lName;
    private String phoneNum;
    private LocalDate joinedDate;
    private LocalDate dob;

    @Embedded
    private Address address;

    @OneToMany(mappedBy = "headOfFamily", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
//    @JsonManagedReference
    private List<FamilyMember> familyMembers;  // List of family members related to this person

    public Person() {
    }

    public Person(Long id, String fName, String mName, String lName, String phoneNum, LocalDate joinedDate, LocalDate dob, Address address, List<FamilyMember> familyMembers) {
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

    public Person(Long id, String fName, String mName, String lName) {
        this.id = id;
        this.fName = fName;
        this.mName = mName;
        this.lName = lName;
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

    public List<FamilyMember> getFamilyMembers() {
        return familyMembers;
    }

    public void setFamilyMembers(List<FamilyMember> familyMembers) {
        this.familyMembers = familyMembers;
    }

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", fName='" + fName + '\'' +
                ", mName='" + mName + '\'' +
                ", lName='" + lName + '\'' +
                ", phoneNum='" + phoneNum + '\'' +
                ", joinedDate=" + joinedDate +
                ", dob=" + dob +
                ", address=" + address +
                ", familyMembers=" + familyMembers +
                '}';
    }
}
