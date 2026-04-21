package com.familiasunidas.familias_unidas.config;

import com.familiasunidas.familias_unidas.model.*;
import com.familiasunidas.familias_unidas.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

    @Autowired private PersonRepository personRepository;
    @Autowired private FamilyMemberRepository familyMemberRepository;
    @Autowired private DeathEventRepository deathEventRepository;
    @Autowired private DonationPaymentRepository donationPaymentRepository;

    private final Random random = new Random(42);

    private static final String[] MALE_NAMES = {
        "Carlos", "Jose", "Luis", "Miguel", "Juan", "Pedro", "Roberto", "Antonio",
        "Francisco", "Manuel", "Jorge", "Alejandro", "Ricardo", "Hector", "Fernando",
        "Eduardo", "Arturo", "Raul", "Ernesto", "Armando", "Gerardo", "Victor",
        "Sergio", "Enrique", "Mario", "Javier", "Ruben", "Alfredo", "Gustavo", "Oscar"
    };

    private static final String[] FEMALE_NAMES = {
        "Maria", "Ana", "Rosa", "Elena", "Sofia", "Carmen", "Isabel", "Guadalupe",
        "Patricia", "Francisca", "Beatriz", "Esperanza", "Concepcion", "Gloria",
        "Dolores", "Luz", "Graciela", "Claudia", "Norma", "Silvia", "Martha",
        "Laura", "Sandra", "Monica", "Diana", "Veronica", "Leticia", "Alicia",
        "Yolanda", "Bertha"
    };

    private static final String[] LAST_NAMES = {
        "Garcia", "Rodriguez", "Martinez", "Lopez", "Gonzalez", "Hernandez",
        "Perez", "Torres", "Ramirez", "Flores", "Rivera", "Gomez", "Diaz",
        "Reyes", "Cruz", "Morales", "Gutierrez", "Ortiz", "Chavez", "Ramos",
        "Castillo", "Jimenez", "Moreno", "Romero", "Herrera", "Medina",
        "Aguilar", "Vargas", "Navarro", "Delgado", "Castro", "Mendoza",
        "Ruiz", "Vega", "Rios", "Sandoval", "Salazar", "Dominguez",
        "Contreras", "Ibarra", "Fuentes", "Soto", "Leal", "Cantu",
        "Trevino", "Garza", "Villarreal", "Esquivel", "Montes", "Pena"
    };

    private static final String[][] CITIES = {
        {"San Antonio", "TX", "78201"},
        {"Houston",     "TX", "77001"},
        {"El Paso",     "TX", "79901"},
        {"Dallas",      "TX", "75201"},
        {"Laredo",      "TX", "78040"},
        {"McAllen",     "TX", "78501"},
        {"Brownsville", "TX", "78520"},
        {"Austin",      "TX", "78701"},
        {"Corpus Christi","TX","78401"},
        {"Amarillo",    "TX", "79101"}
    };

    private static final String[] STREET_TYPES = {
        "Main St", "Oak Ave", "Cedar Ln", "Elm St", "Maple Dr",
        "River Rd", "Sunrise Blvd", "Mission St", "Guadalupe Ave", "Mesquite Dr"
    };

    @Override
    public void run(String... args) {
        if (personRepository.count() > 0) {
            System.out.println("Data already exists — skipping seed.");
            return;
        }

        System.out.println("Seeding mock data...");
        List<Person> families = seedFamilies(112);
        seedDeathEvents(families);
        System.out.println("Done. " + families.size() + " families, 6 death events created.");
    }

    // ── Families ──────────────────────────────────────────────────────────────

    private List<Person> seedFamilies(int count) {
        List<Person> saved = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            boolean isMale = random.nextBoolean();
            String fName = isMale
                    ? MALE_NAMES[random.nextInt(MALE_NAMES.length)]
                    : FEMALE_NAMES[random.nextInt(FEMALE_NAMES.length)];
            String lName = LAST_NAMES[random.nextInt(LAST_NAMES.length)];
            String mName = random.nextInt(3) > 0
                    ? (isMale ? MALE_NAMES[random.nextInt(MALE_NAMES.length)] : FEMALE_NAMES[random.nextInt(FEMALE_NAMES.length)])
                    : null;

            String[] city = CITIES[i % CITIES.length];
            Address address = new Address(
                    (100 + random.nextInt(9900)) + " " + STREET_TYPES[random.nextInt(STREET_TYPES.length)],
                    city[0], city[1], city[2], "USA"
            );

            String phone = String.format("(%03d) %03d-%04d",
                    200 + random.nextInt(600),
                    200 + random.nextInt(700),
                    random.nextInt(10000));

            LocalDate joined = LocalDate.of(2018 + random.nextInt(6), 1 + random.nextInt(12), 1 + random.nextInt(28));
            LocalDate dob = LocalDate.of(1945 + random.nextInt(45), 1 + random.nextInt(12), 1 + random.nextInt(28));

            Person person = new Person();
            person.setfName(fName);
            person.setmName(mName);
            person.setlName(lName);
            person.setPhoneNum(phone);
            person.setJoinedDate(joined);
            person.setDob(dob);
            person.setAddress(address);
            person.setFamilyMembers(new ArrayList<>());

            Person savedPerson = personRepository.save(person);

            // 0–4 family members
            int memberCount = random.nextInt(5);
            for (int j = 0; j < memberCount; j++) {
                addMember(savedPerson, lName, j);
            }

            saved.add(savedPerson);
        }
        return saved;
    }

    private void addMember(Person head, String lastName, int index) {
        // First child/spouse gets spouse slot, rest are children
        String relationship;
        boolean isMale;
        if (index == 0 && random.nextBoolean()) {
            relationship = "Spouse";
            isMale = !random.nextBoolean(); // opposite gender of head (simplified)
        } else {
            boolean son = random.nextBoolean();
            relationship = son ? "Son" : "Daughter";
            isMale = son;
        }

        String fName = isMale
                ? MALE_NAMES[random.nextInt(MALE_NAMES.length)]
                : FEMALE_NAMES[random.nextInt(FEMALE_NAMES.length)];

        int birthYear = relationship.equals("Spouse")
                ? head.getDob().getYear() + random.nextInt(11) - 5
                : head.getDob().getYear() + 20 + random.nextInt(25);
        birthYear = Math.min(birthYear, 2010);

        FamilyMember member = new FamilyMember();
        member.setfName(fName);
        member.setmName(null);
        member.setlName(lastName);
        member.setRelationship(relationship);
        member.setCovered(true); // spouse and children are covered per business rules
        member.setMarried(relationship.equals("Spouse"));
        member.setDob(LocalDate.of(birthYear, 1 + random.nextInt(12), 1 + random.nextInt(28)));
        member.setHeadOfFamily(head);
        familyMemberRepository.save(member);
    }

    // ── Death Events ──────────────────────────────────────────────────────────

    private void seedDeathEvents(List<Person> families) {
        // 18 events spread across 2022–2026 so year selector is visible
        LocalDate[] dates = {
            // 2022
            LocalDate.of(2022, 3, 5),
            LocalDate.of(2022, 7, 18),
            LocalDate.of(2022, 11, 2),
            // 2023
            LocalDate.of(2023, 1, 20),
            LocalDate.of(2023, 4, 14),
            LocalDate.of(2023, 8, 30),
            LocalDate.of(2023, 11, 11),
            // 2024
            LocalDate.of(2024, 2, 8),
            LocalDate.of(2024, 5, 22),
            LocalDate.of(2024, 7, 4),
            LocalDate.of(2024, 10, 19),
            LocalDate.of(2024, 12, 3),
            // 2025
            LocalDate.of(2025, 2, 14),
            LocalDate.of(2025, 6, 27),
            LocalDate.of(2025, 11, 10),
            LocalDate.of(2025, 12, 20),
            // 2026
            LocalDate.of(2026, 1, 15),
            LocalDate.of(2026, 2, 28),
            LocalDate.of(2026, 3, 25),
            LocalDate.of(2026, 4, 8),
        };
        String[] notes = {
            "Passed away peacefully at home.",
            null,
            "Passed away after a long illness.",
            "Suddenly passed away.",
            null,
            "Passed away in the hospital.",
            null,
            "Passed away peacefully at home.",
            "Passed away after a long illness.",
            null,
            "Suddenly passed away.",
            "Passed away in the hospital.",
            null,
            "Passed away peacefully at home.",
            "Passed away after a long illness.",
            null,
            "Suddenly passed away.",
            null,
            "Passed away peacefully at home.",
            "Passed away in the hospital.",
        };
        // Use families spaced apart so they don't overlap
        int[] familyIndices = {0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95};

        for (int i = 0; i < dates.length; i++) {
            Person affected = families.get(familyIndices[i]);
            LocalDate dueDate = dates[i].plusDays(30);

            DeathEvent event = new DeathEvent();
            event.setDateOfDeath(dates[i]);
            event.setAffectedFamily(affected);
            event.setDeceasedMember(null); // head of household
            event.setNotes(notes[i]);
            DeathEvent savedEvent = deathEventRepository.save(event);

            // Generate payments for all other families
            for (Person family : families) {
                if (!family.getId().equals(affected.getId())) {
                    DonationPayment payment = new DonationPayment(savedEvent, family, new BigDecimal("50.00"), dueDate);
                    donationPaymentRepository.save(payment);
                }
            }

            // Mark payments as paid based on how old the event is
            markPayments(savedEvent, dates[i], dueDate);
        }
    }

    private void markPayments(DeathEvent event, LocalDate eventDate, LocalDate dueDate) {
        LocalDate today = LocalDate.now();
        List<DonationPayment> payments = donationPaymentRepository.findByDeathEventId(event.getId());

        // Older events have higher collection rates
        long daysOld = today.toEpochDay() - eventDate.toEpochDay();
        double paidRate = daysOld > 60 ? 0.88
                        : daysOld > 30 ? 0.72
                        : daysOld > 14 ? 0.55
                        : 0.30;

        for (DonationPayment payment : payments) {
            if (random.nextDouble() < paidRate) {
                payment.setPaid(true);
                // Paid date is somewhere between event date and dueDate
                int daysAfterEvent = 1 + random.nextInt((int) Math.min(28, daysOld));
                payment.setPaidDate(eventDate.plusDays(daysAfterEvent));
                donationPaymentRepository.save(payment);
            }
        }
    }
}
