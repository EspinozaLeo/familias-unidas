package com.familiasunidas.familias_unidas.service;

import com.familiasunidas.familias_unidas.dto.CreateDeathEventRequest;
import com.familiasunidas.familias_unidas.dto.DeathEventDTO;
import com.familiasunidas.familias_unidas.model.DeathEvent;
import com.familiasunidas.familias_unidas.model.DonationPayment;
import com.familiasunidas.familias_unidas.model.FamilyMember;
import com.familiasunidas.familias_unidas.model.Person;
import com.familiasunidas.familias_unidas.repository.DeathEventRepository;
import com.familiasunidas.familias_unidas.repository.DonationPaymentRepository;
import com.familiasunidas.familias_unidas.repository.FamilyMemberRepository;
import com.familiasunidas.familias_unidas.repository.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeathEventService {

    private final DeathEventRepository deathEventRepository;
    private final DonationPaymentRepository donationPaymentRepository;
    private final PersonRepository personRepository;
    private final FamilyMemberRepository familyMemberRepository;

    private static final BigDecimal DEFAULT_DONATION_AMOUNT = new BigDecimal("50.00");

    @Autowired
    public DeathEventService(DeathEventRepository deathEventRepository,
                             DonationPaymentRepository donationPaymentRepository,
                             PersonRepository personRepository,
                             FamilyMemberRepository familyMemberRepository) {
        this.deathEventRepository = deathEventRepository;
        this.donationPaymentRepository = donationPaymentRepository;
        this.personRepository = personRepository;
        this.familyMemberRepository = familyMemberRepository;
    }

    public List<DeathEventDTO> getAllDeathEvents() {
        return deathEventRepository.findAllByOrderByDateOfDeathDesc()
                .stream()
                .map(DeathEventDTO::new)
                .collect(Collectors.toList());
    }

    public ResponseEntity<DeathEventDTO> getDeathEventById(Long id) {
        return deathEventRepository.findById(id)
                .map(event -> ResponseEntity.ok(new DeathEventDTO(event)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    public ResponseEntity<DeathEventDTO> createDeathEvent(CreateDeathEventRequest request) {
        // Look up the affected household
        Person affectedFamily = personRepository.findById(request.getAffectedFamilyId())
                .orElse(null);
        if (affectedFamily == null) {
            return ResponseEntity.badRequest().build();
        }

        // Look up the deceased family member if provided
        FamilyMember deceasedMember = null;
        if (request.getDeceasedMemberId() != null) {
            deceasedMember = familyMemberRepository.findById(request.getDeceasedMemberId())
                    .orElse(null);
            if (deceasedMember == null) {
                return ResponseEntity.badRequest().build();
            }
        }

        // Determine the donation amount
        BigDecimal donationAmount = (request.getDonationAmount() != null)
                ? request.getDonationAmount()
                : DEFAULT_DONATION_AMOUNT;

        // Save the death event
        DeathEvent event = new DeathEvent(
                request.getDateOfDeath(),
                request.getNotes(),
                affectedFamily,
                deceasedMember
        );
        DeathEvent savedEvent = deathEventRepository.save(event);

        // Generate one DonationPayment for every enrolled family except the affected one
        LocalDate dueDate = request.getDateOfDeath().plusDays(30);
        List<Person> allFamilies = personRepository.findAll();
        for (Person family : allFamilies) {
            if (!family.getId().equals(affectedFamily.getId())) {
                DonationPayment payment = new DonationPayment(savedEvent, family, donationAmount, dueDate);
                donationPaymentRepository.save(payment);
            }
        }

        // Reload to include the generated payments in the response
        DeathEvent reloaded = deathEventRepository.findById(savedEvent.getId()).orElse(savedEvent);
        return ResponseEntity.ok(new DeathEventDTO(reloaded));
    }

    @Transactional
    public ResponseEntity<Void> deleteDeathEvent(Long id) {
        if (!deathEventRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        deathEventRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
