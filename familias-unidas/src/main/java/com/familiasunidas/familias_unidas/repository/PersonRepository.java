package com.familiasunidas.familias_unidas.repository;

import com.familiasunidas.familias_unidas.dto.PersonDTO;
import com.familiasunidas.familias_unidas.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    @Query("SELECT p FROM Person p WHERE LOWER(p.fName) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "OR LOWER(p.mName) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "OR LOWER(p.lName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Person> searchByName(@Param("name") String name);
}
