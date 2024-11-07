package com.familiasunidas.familias_unidas.repository;

import com.familiasunidas.familias_unidas.model.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
    @Modifying
    @Query(value = "DELETE FROM family_member WHERE id = :id", nativeQuery = true)
    void deleteFamilyMemberById(@Param("id") Long id);
}