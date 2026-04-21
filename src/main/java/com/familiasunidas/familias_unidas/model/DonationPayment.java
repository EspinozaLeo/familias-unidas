package com.familiasunidas.familias_unidas.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "donation_payment")
public class DonationPayment {

    @Id
    @SequenceGenerator(
            name = "donation_payment_sequence",
            sequenceName = "donation_payment_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "donation_payment_sequence"
    )
    private Long id;

    @ManyToOne
    @JoinColumn(name = "death_event_id", nullable = false)
    private DeathEvent deathEvent;

    // The family that owes the donation
    @ManyToOne
    @JoinColumn(name = "family_id", nullable = false)
    private Person family;

    private boolean paid = false;
    private LocalDate paidDate;
    private LocalDate dueDate;
    private BigDecimal amount = new BigDecimal("50.00");

    public DonationPayment() {}

    public DonationPayment(DeathEvent deathEvent, Person family, BigDecimal amount, LocalDate dueDate) {
        this.deathEvent = deathEvent;
        this.family = family;
        this.amount = amount;
        this.dueDate = dueDate;
        this.paid = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DeathEvent getDeathEvent() { return deathEvent; }
    public void setDeathEvent(DeathEvent deathEvent) { this.deathEvent = deathEvent; }

    public Person getFamily() { return family; }
    public void setFamily(Person family) { this.family = family; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }

    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
