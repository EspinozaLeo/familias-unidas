package com.familiasunidas.familias_unidas.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnalyticsDTO {

    // ── Summary ──────────────────────────────────────────────────────────────
    private int totalFamilies;
    private int totalEvents;
    private BigDecimal totalCollected;
    private BigDecimal totalOutstanding;
    private int totalOverdue;
    private int totalPaid;
    private int totalPending;

    // ── Events by month, grouped by year ────────────────────────────────────
    private List<MonthCount> eventsByMonth;
    private List<YearMonthData> eventsByYear;

    // ── Collection rate per event ─────────────────────────────────────────────
    private List<EventCollectionRate> collectionRates;

    // ── Family payment reliability ────────────────────────────────────────────
    private List<FamilyReliability> familyReliability;

    // ── Overdue families ──────────────────────────────────────────────────────
    private List<OverdueEntry> overdueFamilies;

    public AnalyticsDTO() {}

    // ── Nested types ─────────────────────────────────────────────────────────

    public static class MonthCount {
        private String month;
        private int count;
        public MonthCount(String month, int count) { this.month = month; this.count = count; }
        public String getMonth() { return month; }
        public int getCount() { return count; }
    }

    public static class YearMonthData {
        private int year;
        private int totalEvents;
        private List<MonthCount> months;
        public YearMonthData(int year, int totalEvents, List<MonthCount> months) {
            this.year = year;
            this.totalEvents = totalEvents;
            this.months = months;
        }
        public int getYear() { return year; }
        public int getTotalEvents() { return totalEvents; }
        public List<MonthCount> getMonths() { return months; }
    }

    public static class EventCollectionRate {
        private Long eventId;
        private String deceasedName;
        private String dateOfDeath;
        private int totalFamilies;
        private int paidCount;
        private double rate; // percentage
        public EventCollectionRate(Long eventId, String deceasedName, String dateOfDeath, int totalFamilies, int paidCount) {
            this.eventId = eventId;
            this.deceasedName = deceasedName;
            this.dateOfDeath = dateOfDeath;
            this.totalFamilies = totalFamilies;
            this.paidCount = paidCount;
            this.rate = totalFamilies > 0 ? Math.round((paidCount * 100.0 / totalFamilies) * 10.0) / 10.0 : 0;
        }
        public Long getEventId() { return eventId; }
        public String getDeceasedName() { return deceasedName; }
        public String getDateOfDeath() { return dateOfDeath; }
        public int getTotalFamilies() { return totalFamilies; }
        public int getPaidCount() { return paidCount; }
        public double getRate() { return rate; }
    }

    public static class FamilyReliability {
        private Long familyId;
        private String familyName;
        private int totalOwed;
        private int totalPaid;
        private int totalOverdue;
        private double rate;
        public FamilyReliability(Long familyId, String familyName, int totalOwed, int totalPaid, int totalOverdue) {
            this.familyId = familyId;
            this.familyName = familyName;
            this.totalOwed = totalOwed;
            this.totalPaid = totalPaid;
            this.totalOverdue = totalOverdue;
            this.rate = totalOwed > 0 ? Math.round((totalPaid * 100.0 / totalOwed) * 10.0) / 10.0 : 100;
        }
        public Long getFamilyId() { return familyId; }
        public String getFamilyName() { return familyName; }
        public int getTotalOwed() { return totalOwed; }
        public int getTotalPaid() { return totalPaid; }
        public int getTotalOverdue() { return totalOverdue; }
        public double getRate() { return rate; }
    }

    public static class OverdueEntry {
        private Long paymentId;
        private Long familyId;
        private String familyName;
        private String familyPhone;
        private String deceasedName;
        private String dueDate;
        private BigDecimal amount;
        public OverdueEntry(Long paymentId, Long familyId, String familyName, String familyPhone,
                            String deceasedName, String dueDate, BigDecimal amount) {
            this.paymentId = paymentId;
            this.familyId = familyId;
            this.familyName = familyName;
            this.familyPhone = familyPhone;
            this.deceasedName = deceasedName;
            this.dueDate = dueDate;
            this.amount = amount;
        }
        public Long getPaymentId() { return paymentId; }
        public Long getFamilyId() { return familyId; }
        public String getFamilyName() { return familyName; }
        public String getFamilyPhone() { return familyPhone; }
        public String getDeceasedName() { return deceasedName; }
        public String getDueDate() { return dueDate; }
        public BigDecimal getAmount() { return amount; }
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public int getTotalFamilies() { return totalFamilies; }
    public void setTotalFamilies(int totalFamilies) { this.totalFamilies = totalFamilies; }

    public int getTotalEvents() { return totalEvents; }
    public void setTotalEvents(int totalEvents) { this.totalEvents = totalEvents; }

    public BigDecimal getTotalCollected() { return totalCollected; }
    public void setTotalCollected(BigDecimal totalCollected) { this.totalCollected = totalCollected; }

    public BigDecimal getTotalOutstanding() { return totalOutstanding; }
    public void setTotalOutstanding(BigDecimal totalOutstanding) { this.totalOutstanding = totalOutstanding; }

    public int getTotalOverdue() { return totalOverdue; }
    public void setTotalOverdue(int totalOverdue) { this.totalOverdue = totalOverdue; }

    public int getTotalPaid() { return totalPaid; }
    public void setTotalPaid(int totalPaid) { this.totalPaid = totalPaid; }

    public int getTotalPending() { return totalPending; }
    public void setTotalPending(int totalPending) { this.totalPending = totalPending; }

    public List<MonthCount> getEventsByMonth() { return eventsByMonth; }
    public void setEventsByMonth(List<MonthCount> eventsByMonth) { this.eventsByMonth = eventsByMonth; }

    public List<YearMonthData> getEventsByYear() { return eventsByYear; }
    public void setEventsByYear(List<YearMonthData> eventsByYear) { this.eventsByYear = eventsByYear; }

    public List<EventCollectionRate> getCollectionRates() { return collectionRates; }
    public void setCollectionRates(List<EventCollectionRate> collectionRates) { this.collectionRates = collectionRates; }

    public List<FamilyReliability> getFamilyReliability() { return familyReliability; }
    public void setFamilyReliability(List<FamilyReliability> familyReliability) { this.familyReliability = familyReliability; }

    public List<OverdueEntry> getOverdueFamilies() { return overdueFamilies; }
    public void setOverdueFamilies(List<OverdueEntry> overdueFamilies) { this.overdueFamilies = overdueFamilies; }
}
