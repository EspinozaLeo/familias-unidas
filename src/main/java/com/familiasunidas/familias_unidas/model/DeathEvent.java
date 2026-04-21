package com.familiasunidas.familias_unidas.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "death_event")
public class DeathEvent {

    @Id
    @SequenceGenerator(
            name = "death_event_sequence",
            sequenceName = "death_event_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "death_event_sequence"
    )
    private Long id;

    private LocalDate dateOfDeath;
    private String notes;

    // The household that experienced the death
    @ManyToOne
    @JoinColumn(name = "affected_family_id", nullable = false)
    private Person affectedFamily;

    // Null means the head of household (Person) passed away.
    // Non-null means a FamilyMember passed away.
    @ManyToOne
    @JoinColumn(name = "deceased_member_id", nullable = true)
    private FamilyMember deceasedMember;

    @OneToMany(mappedBy = "deathEvent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationPayment> donationPayments = new ArrayList<>();

    public DeathEvent() {}

    public DeathEvent(LocalDate dateOfDeath, String notes, Person affectedFamily, FamilyMember deceasedMember) {
        this.dateOfDeath = dateOfDeath;
        this.notes = notes;
        this.affectedFamily = affectedFamily;
        this.deceasedMember = deceasedMember;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDateOfDeath() { return dateOfDeath; }
    public void setDateOfDeath(LocalDate dateOfDeath) { this.dateOfDeath = dateOfDeath; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Person getAffectedFamily() { return affectedFamily; }
    public void setAffectedFamily(Person affectedFamily) { this.affectedFamily = affectedFamily; }

    public FamilyMember getDeceasedMember() { return deceasedMember; }
    public void setDeceasedMember(FamilyMember deceasedMember) { this.deceasedMember = deceasedMember; }

    public List<DonationPayment> getDonationPayments() { return donationPayments; }
    public void setDonationPayments(List<DonationPayment> donationPayments) { this.donationPayments = donationPayments; }
}
