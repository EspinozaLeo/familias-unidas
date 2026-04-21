package com.familiasunidas.familias_unidas.service;

import com.familiasunidas.familias_unidas.dto.AnalyticsDTO;
import com.familiasunidas.familias_unidas.model.DeathEvent;
import com.familiasunidas.familias_unidas.model.DonationPayment;
import com.familiasunidas.familias_unidas.model.Person;
import com.familiasunidas.familias_unidas.repository.DeathEventRepository;
import com.familiasunidas.familias_unidas.repository.DonationPaymentRepository;
import com.familiasunidas.familias_unidas.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final PersonRepository personRepository;
    private final DeathEventRepository deathEventRepository;
    private final DonationPaymentRepository donationPaymentRepository;

    @Autowired
    public AnalyticsService(PersonRepository personRepository,
                            DeathEventRepository deathEventRepository,
                            DonationPaymentRepository donationPaymentRepository) {
        this.personRepository = personRepository;
        this.deathEventRepository = deathEventRepository;
        this.donationPaymentRepository = donationPaymentRepository;
    }

    public AnalyticsDTO getSummary() {
        AnalyticsDTO dto = new AnalyticsDTO();

        List<Person> allFamilies = personRepository.findAll();
        List<DeathEvent> allEvents = deathEventRepository.findAll();
        List<DonationPayment> allPayments = donationPaymentRepository.findAll();

        LocalDate today = LocalDate.now();

        // ── Summary stats ─────────────────────────────────────────────────────
        dto.setTotalFamilies(allFamilies.size());
        dto.setTotalEvents(allEvents.size());

        BigDecimal collected = allPayments.stream()
                .filter(DonationPayment::isPaid)
                .map(DonationPayment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalCollected(collected);

        BigDecimal outstanding = allPayments.stream()
                .filter(p -> !p.isPaid())
                .map(DonationPayment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalOutstanding(outstanding);

        long overdue = allPayments.stream()
                .filter(p -> !p.isPaid() && p.getDueDate() != null && today.isAfter(p.getDueDate()))
                .count();
        dto.setTotalOverdue((int) overdue);

        dto.setTotalPaid((int) allPayments.stream().filter(DonationPayment::isPaid).count());
        dto.setTotalPending((int) allPayments.stream()
                .filter(p -> !p.isPaid() && (p.getDueDate() == null || !today.isAfter(p.getDueDate())))
                .count());

        // ── Events by month — current year (kept for backward compat) ────────
        String[] monthNames = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        int currentYear = today.getYear();
        int[] monthlyCounts = new int[12];
        for (DeathEvent e : allEvents) {
            if (e.getDateOfDeath() != null && e.getDateOfDeath().getYear() == currentYear) {
                monthlyCounts[e.getDateOfDeath().getMonthValue() - 1]++;
            }
        }
        List<AnalyticsDTO.MonthCount> eventsByMonth = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            eventsByMonth.add(new AnalyticsDTO.MonthCount(monthNames[i], monthlyCounts[i]));
        }
        dto.setEventsByMonth(eventsByMonth);

        // ── Events by month grouped by ALL years ──────────────────────────────
        // Collect distinct years from events, sorted descending
        List<Integer> years = allEvents.stream()
                .filter(e -> e.getDateOfDeath() != null)
                .map(e -> e.getDateOfDeath().getYear())
                .distinct()
                .sorted(Comparator.reverseOrder())
                .collect(Collectors.toList());

        List<AnalyticsDTO.YearMonthData> eventsByYear = new ArrayList<>();
        for (int year : years) {
            int[] counts = new int[12];
            for (DeathEvent e : allEvents) {
                if (e.getDateOfDeath() != null && e.getDateOfDeath().getYear() == year) {
                    counts[e.getDateOfDeath().getMonthValue() - 1]++;
                }
            }
            List<AnalyticsDTO.MonthCount> months = new ArrayList<>();
            int yearTotal = 0;
            for (int i = 0; i < 12; i++) {
                months.add(new AnalyticsDTO.MonthCount(monthNames[i], counts[i]));
                yearTotal += counts[i];
            }
            eventsByYear.add(new AnalyticsDTO.YearMonthData(year, yearTotal, months));
        }
        dto.setEventsByYear(eventsByYear);

        // ── Collection rate per event (most recent 10) ────────────────────────
        List<AnalyticsDTO.EventCollectionRate> rates = allEvents.stream()
                .sorted(Comparator.comparing(DeathEvent::getDateOfDeath, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .map(e -> {
                    int total = e.getDonationPayments().size();
                    int paid = (int) e.getDonationPayments().stream().filter(DonationPayment::isPaid).count();
                    String dateStr = e.getDateOfDeath() != null
                            ? e.getDateOfDeath().format(DateTimeFormatter.ofPattern("MMM d, yyyy")) : "";
                    String deceased = e.getDeceasedMember() != null
                            ? e.getDeceasedMember().getfName() + " " + e.getDeceasedMember().getlName()
                            : e.getAffectedFamily().getfName() + " " + e.getAffectedFamily().getlName();
                    return new AnalyticsDTO.EventCollectionRate(e.getId(), deceased, dateStr, total, paid);
                })
                .collect(Collectors.toList());
        dto.setCollectionRates(rates);

        // ── Family payment reliability ─────────────────────────────────────────
        Map<Long, int[]> familyStats = new HashMap<>(); // [totalOwed, totalPaid, totalOverdue]
        Map<Long, String> familyNames = new HashMap<>();
        Map<Long, String> familyPhones = new HashMap<>();

        for (DonationPayment p : allPayments) {
            Long fid = p.getFamily().getId();
            familyStats.putIfAbsent(fid, new int[]{0, 0, 0});
            familyNames.put(fid, p.getFamily().getfName() + " "
                    + (p.getFamily().getmName() != null ? p.getFamily().getmName() + " " : "")
                    + p.getFamily().getlName());
            familyPhones.put(fid, p.getFamily().getPhoneNum());
            familyStats.get(fid)[0]++;
            if (p.isPaid()) familyStats.get(fid)[1]++;
            if (!p.isPaid() && p.getDueDate() != null && today.isAfter(p.getDueDate())) familyStats.get(fid)[2]++;
        }

        List<AnalyticsDTO.FamilyReliability> reliability = familyStats.entrySet().stream()
                .map(entry -> new AnalyticsDTO.FamilyReliability(
                        entry.getKey(),
                        familyNames.get(entry.getKey()),
                        entry.getValue()[0],
                        entry.getValue()[1],
                        entry.getValue()[2]
                ))
                .sorted(Comparator.comparingDouble(AnalyticsDTO.FamilyReliability::getRate))
                .collect(Collectors.toList());
        dto.setFamilyReliability(reliability);

        // ── Overdue families ──────────────────────────────────────────────────
        List<AnalyticsDTO.OverdueEntry> overdueList = allPayments.stream()
                .filter(p -> !p.isPaid() && p.getDueDate() != null && today.isAfter(p.getDueDate()))
                .map(p -> {
                    String deceased = p.getDeathEvent().getDeceasedMember() != null
                            ? p.getDeathEvent().getDeceasedMember().getfName() + " " + p.getDeathEvent().getDeceasedMember().getlName()
                            : p.getDeathEvent().getAffectedFamily().getfName() + " " + p.getDeathEvent().getAffectedFamily().getlName();
                    String dueStr = p.getDueDate().format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
                    String name = p.getFamily().getfName() + " "
                            + (p.getFamily().getmName() != null ? p.getFamily().getmName() + " " : "")
                            + p.getFamily().getlName();
                    return new AnalyticsDTO.OverdueEntry(
                            p.getId(), p.getFamily().getId(), name,
                            p.getFamily().getPhoneNum(), deceased, dueStr, p.getAmount()
                    );
                })
                .sorted(Comparator.comparing(AnalyticsDTO.OverdueEntry::getFamilyName))
                .collect(Collectors.toList());
        dto.setOverdueFamilies(overdueList);

        return dto;
    }
}
