package com.familiasunidas.familias_unidas.controller;

import com.familiasunidas.familias_unidas.dto.DonationPaymentDTO;
import com.familiasunidas.familias_unidas.service.DonationPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "api/v1/payments")
public class DonationPaymentController {

    private final DonationPaymentService donationPaymentService;

    @Autowired
    public DonationPaymentController(DonationPaymentService donationPaymentService) {
        this.donationPaymentService = donationPaymentService;
    }

    // Get all payments for a specific death event
    @GetMapping("/death-event/{deathEventId}")
    public List<DonationPaymentDTO> getPaymentsByDeathEvent(@PathVariable Long deathEventId) {
        return donationPaymentService.getPaymentsByDeathEvent(deathEventId);
    }

    // Get all payments a specific family owes (across all death events)
    @GetMapping("/family/{familyId}")
    public List<DonationPaymentDTO> getPaymentsByFamily(@PathVariable Long familyId) {
        return donationPaymentService.getPaymentsByFamily(familyId);
    }

    // Get only unpaid payments for a death event
    @GetMapping("/death-event/{deathEventId}/unpaid")
    public List<DonationPaymentDTO> getUnpaidByDeathEvent(@PathVariable Long deathEventId) {
        return donationPaymentService.getUnpaidByDeathEvent(deathEventId);
    }

    // Get only paid payments for a death event
    @GetMapping("/death-event/{deathEventId}/paid")
    public List<DonationPaymentDTO> getPaidByDeathEvent(@PathVariable Long deathEventId) {
        return donationPaymentService.getPaidByDeathEvent(deathEventId);
    }

    // Mark a payment as paid
    // Optional body: { "paidDate": "2024-04-15" } — defaults to today if omitted
    @PatchMapping("/{paymentId}/paid")
    public ResponseEntity<DonationPaymentDTO> markAsPaid(
            @PathVariable Long paymentId,
            @RequestBody(required = false) Map<String, String> body) {
        LocalDate paidDate = null;
        if (body != null && body.containsKey("paidDate")) {
            paidDate = LocalDate.parse(body.get("paidDate"));
        }
        return donationPaymentService.markAsPaid(paymentId, paidDate);
    }

    // Mark a payment as unpaid (undo)
    @PatchMapping("/{paymentId}/unpaid")
    public ResponseEntity<DonationPaymentDTO> markAsUnpaid(@PathVariable Long paymentId) {
        return donationPaymentService.markAsUnpaid(paymentId);
    }
}
