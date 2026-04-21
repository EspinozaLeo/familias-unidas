package com.familiasunidas.familias_unidas.dto;

import com.familiasunidas.familias_unidas.model.DeathEvent;

import java.time.LocalDate;

public class DeathEventDTO {

    private Long id;
    private LocalDate dateOfDeath;
    private String notes;

    // Affected household
    private Long affectedFamilyId;
    private String affectedFamilyName;

    // Who died — null means the head of household
    private Long deceasedMemberId;
    private String deceasedName;
    private String deceasedRelationship;

    // Payment summary
    private int totalFamilies;
    private int paidCount;
    private int unpaidCount;
    private int overdueCount;

    public DeathEventDTO() {}

    public DeathEventDTO(DeathEvent event) {
        this.id = event.getId();
        this.dateOfDeath = event.getDateOfDeath();
        this.notes = event.getNotes();
        this.affectedFamilyId = event.getAffectedFamily().getId();
        this.affectedFamilyName = event.getAffectedFamily().getfName() + " "
                + (event.getAffectedFamily().getmName() != null ? event.getAffectedFamily().getmName() + " " : "")
                + event.getAffectedFamily().getlName();

        if (event.getDeceasedMember() != null) {
            this.deceasedMemberId = event.getDeceasedMember().getId();
            this.deceasedName = event.getDeceasedMember().getfName() + " "
                    + (event.getDeceasedMember().getmName() != null ? event.getDeceasedMember().getmName() + " " : "")
                    + event.getDeceasedMember().getlName();
            this.deceasedRelationship = event.getDeceasedMember().getRelationship();
        } else {
            // Head of household passed away
            this.deceasedMemberId = null;
            this.deceasedName = this.affectedFamilyName;
            this.deceasedRelationship = "Head of Household";
        }

        if (event.getDonationPayments() != null) {
            this.totalFamilies = event.getDonationPayments().size();
            this.paidCount = (int) event.getDonationPayments().stream().filter(p -> p.isPaid()).count();
            this.unpaidCount = this.totalFamilies - this.paidCount;
            this.overdueCount = (int) event.getDonationPayments().stream()
                    .filter(p -> !p.isPaid() && p.getDueDate() != null && LocalDate.now().isAfter(p.getDueDate()))
                    .count();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDateOfDeath() { return dateOfDeath; }
    public void setDateOfDeath(LocalDate dateOfDeath) { this.dateOfDeath = dateOfDeath; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getAffectedFamilyId() { return affectedFamilyId; }
    public void setAffectedFamilyId(Long affectedFamilyId) { this.affectedFamilyId = affectedFamilyId; }

    public String getAffectedFamilyName() { return affectedFamilyName; }
    public void setAffectedFamilyName(String affectedFamilyName) { this.affectedFamilyName = affectedFamilyName; }

    public Long getDeceasedMemberId() { return deceasedMemberId; }
    public void setDeceasedMemberId(Long deceasedMemberId) { this.deceasedMemberId = deceasedMemberId; }

    public String getDeceasedName() { return deceasedName; }
    public void setDeceasedName(String deceasedName) { this.deceasedName = deceasedName; }

    public String getDeceasedRelationship() { return deceasedRelationship; }
    public void setDeceasedRelationship(String deceasedRelationship) { this.deceasedRelationship = deceasedRelationship; }

    public int getTotalFamilies() { return totalFamilies; }
    public void setTotalFamilies(int totalFamilies) { this.totalFamilies = totalFamilies; }

    public int getPaidCount() { return paidCount; }
    public void setPaidCount(int paidCount) { this.paidCount = paidCount; }

    public int getUnpaidCount() { return unpaidCount; }
    public void setUnpaidCount(int unpaidCount) { this.unpaidCount = unpaidCount; }

    public int getOverdueCount() { return overdueCount; }
    public void setOverdueCount(int overdueCount) { this.overdueCount = overdueCount; }
}
