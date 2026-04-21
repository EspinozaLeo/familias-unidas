package com.familiasunidas.familias_unidas.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateDeathEventRequest {

    private Long affectedFamilyId;    // Person ID of the household that had the death
    private Long deceasedMemberId;    // FamilyMember ID — null if the head of household died
    private LocalDate dateOfDeath;
    private String notes;
    private BigDecimal donationAmount; // Optional override; defaults to 50.00

    public CreateDeathEventRequest() {}

    public Long getAffectedFamilyId() { return affectedFamilyId; }
    public void setAffectedFamilyId(Long affectedFamilyId) { this.affectedFamilyId = affectedFamilyId; }

    public Long getDeceasedMemberId() { return deceasedMemberId; }
    public void setDeceasedMemberId(Long deceasedMemberId) { this.deceasedMemberId = deceasedMemberId; }

    public LocalDate getDateOfDeath() { return dateOfDeath; }
    public void setDateOfDeath(LocalDate dateOfDeath) { this.dateOfDeath = dateOfDeath; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public BigDecimal getDonationAmount() { return donationAmount; }
    public void setDonationAmount(BigDecimal donationAmount) { this.donationAmount = donationAmount; }
}
