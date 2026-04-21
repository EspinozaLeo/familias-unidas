package com.familiasunidas.familias_unidas.dto;

import com.familiasunidas.familias_unidas.model.DonationPayment;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DonationPaymentDTO {

    private Long id;
    private Long deathEventId;
    private Long familyId;
    private String familyName;
    private String familyPhone;
    private boolean paid;
    private LocalDate paidDate;
    private LocalDate dueDate;
    private boolean overdue;
    private BigDecimal amount;

    public DonationPaymentDTO() {}

    public DonationPaymentDTO(DonationPayment payment) {
        this.id = payment.getId();
        this.deathEventId = payment.getDeathEvent().getId();
        this.familyId = payment.getFamily().getId();
        this.familyName = payment.getFamily().getfName() + " "
                + (payment.getFamily().getmName() != null ? payment.getFamily().getmName() + " " : "")
                + payment.getFamily().getlName();
        this.familyPhone = payment.getFamily().getPhoneNum();
        this.paid = payment.isPaid();
        this.paidDate = payment.getPaidDate();
        this.dueDate = payment.getDueDate();
        this.overdue = !payment.isPaid()
                && payment.getDueDate() != null
                && LocalDate.now().isAfter(payment.getDueDate());
        this.amount = payment.getAmount();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDeathEventId() { return deathEventId; }
    public void setDeathEventId(Long deathEventId) { this.deathEventId = deathEventId; }

    public Long getFamilyId() { return familyId; }
    public void setFamilyId(Long familyId) { this.familyId = familyId; }

    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }

    public String getFamilyPhone() { return familyPhone; }
    public void setFamilyPhone(String familyPhone) { this.familyPhone = familyPhone; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }

    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public boolean isOverdue() { return overdue; }
    public void setOverdue(boolean overdue) { this.overdue = overdue; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
