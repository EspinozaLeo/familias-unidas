package com.familiasunidas.familias_unidas.repository;

import com.familiasunidas.familias_unidas.model.DonationPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationPaymentRepository extends JpaRepository<DonationPayment, Long> {

    List<DonationPayment> findByDeathEventId(Long deathEventId);

    List<DonationPayment> findByFamilyId(Long familyId);

    @Query("SELECT dp FROM DonationPayment dp WHERE dp.deathEvent.id = :eventId AND dp.paid = false")
    List<DonationPayment> findUnpaidByDeathEventId(@Param("eventId") Long eventId);

    @Query("SELECT dp FROM DonationPayment dp WHERE dp.deathEvent.id = :eventId AND dp.paid = true")
    List<DonationPayment> findPaidByDeathEventId(@Param("eventId") Long eventId);
}
