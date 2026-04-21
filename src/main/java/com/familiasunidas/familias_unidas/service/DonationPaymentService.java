package com.familiasunidas.familias_unidas.service;

import com.familiasunidas.familias_unidas.dto.DonationPaymentDTO;
import com.familiasunidas.familias_unidas.model.DonationPayment;
import com.familiasunidas.familias_unidas.repository.DonationPaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationPaymentService {

    private final DonationPaymentRepository donationPaymentRepository;

    @Autowired
    public DonationPaymentService(DonationPaymentRepository donationPaymentRepository) {
        this.donationPaymentRepository = donationPaymentRepository;
    }

    public List<DonationPaymentDTO> getPaymentsByDeathEvent(Long deathEventId) {
        return donationPaymentRepository.findByDeathEventId(deathEventId)
                .stream()
                .map(DonationPaymentDTO::new)
                .collect(Collectors.toList());
    }

    public List<DonationPaymentDTO> getPaymentsByFamily(Long familyId) {
        return donationPaymentRepository.findByFamilyId(familyId)
                .stream()
                .map(DonationPaymentDTO::new)
                .collect(Collectors.toList());
    }

    public List<DonationPaymentDTO> getUnpaidByDeathEvent(Long deathEventId) {
        return donationPaymentRepository.findUnpaidByDeathEventId(deathEventId)
                .stream()
                .map(DonationPaymentDTO::new)
                .collect(Collectors.toList());
    }

    public List<DonationPaymentDTO> getPaidByDeathEvent(Long deathEventId) {
        return donationPaymentRepository.findPaidByDeathEventId(deathEventId)
                .stream()
                .map(DonationPaymentDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResponseEntity<DonationPaymentDTO> markAsPaid(Long paymentId, LocalDate paidDate) {
        return donationPaymentRepository.findById(paymentId)
                .map(payment -> {
                    payment.setPaid(true);
                    payment.setPaidDate(paidDate != null ? paidDate : LocalDate.now());
                    donationPaymentRepository.save(payment);
                    return ResponseEntity.ok(new DonationPaymentDTO(payment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    public ResponseEntity<DonationPaymentDTO> markAsUnpaid(Long paymentId) {
        return donationPaymentRepository.findById(paymentId)
                .map(payment -> {
                    payment.setPaid(false);
                    payment.setPaidDate(null);
                    donationPaymentRepository.save(payment);
                    return ResponseEntity.ok(new DonationPaymentDTO(payment));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
