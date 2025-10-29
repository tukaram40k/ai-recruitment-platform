package hr.recruitment.controller;

import hr.recruitment.model.User;
import hr.recruitment.model.enums.Role;
import hr.recruitment.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CandidateProfileControllerSimpleIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileController candidateProfileController;

    @Test
    void verifyDatabasePopulation() {
        // Verify that we have the expected number of users
        long totalUsers = userRepository.count();
        assertTrue(totalUsers >= 50, "Should have at least 50 users in database, but found: " + totalUsers);

        // Verify we have candidates
        List<User> candidates = userRepository.findByRole(Role.ROLE_CANDIDATE);
        assertTrue(candidates.size() >= 30, "Should have at least 30 candidates, but found: " + candidates.size());

        // Verify we have recruiters
        List<User> recruiters = userRepository.findByRole(Role.ROLE_RECRUITER);
        assertTrue(recruiters.size() >= 18, "Should have at least 18 recruiters, but found: " + recruiters.size());

        // Verify we have admins
        List<User> admins = userRepository.findByRole(Role.ROLE_ADMIN);
        assertTrue(admins.size() >= 2, "Should have at least 2 admins, but found: " + admins.size());
    }

    @Test
    void getCandidateProfile_WithRealData_Success() {
        // Find a candidate from the database
        Optional<User> candidateOpt = userRepository.findByRole(Role.ROLE_CANDIDATE)
                .stream().findFirst();
        
        assertTrue(candidateOpt.isPresent(), "Should have at least one candidate in database");
        
        User candidate = candidateOpt.get();
        String emailPrefix = candidate.getEmail().split("@")[0];

        try {
            var response = candidateProfileController.getCandidateProfile(emailPrefix);
            
            assertEquals(200, response.getStatusCode().value());
            User responseBody = response.getBody();
            assertNotNull(responseBody);
            
            assertEquals(candidate.getId(), responseBody.getId());
            assertEquals(candidate.getName(), responseBody.getName());
            assertEquals(candidate.getEmail(), responseBody.getEmail());
            assertEquals(Role.ROLE_CANDIDATE, responseBody.getRole());
            
            System.out.println("✅ GET Success Test: Retrieved candidate profile for " + emailPrefix);
            System.out.println("   - ID: " + responseBody.getId());
            System.out.println("   - Name: " + responseBody.getName());
            System.out.println("   - Email: " + responseBody.getEmail());
            System.out.println("   - Role: " + responseBody.getRole());
        } catch (Exception e) {
            fail("Should not throw exception for valid candidate: " + e.getMessage());
        }
    }

    @Test
    void getCandidateProfile_WithRecruiter_BadRequest() {
        // Find a recruiter from the database
        Optional<User> recruiterOpt = userRepository.findByRole(Role.ROLE_RECRUITER)
                .stream().findFirst();
        
        assertTrue(recruiterOpt.isPresent(), "Should have at least one recruiter in database");
        
        User recruiter = recruiterOpt.get();
        String emailPrefix = recruiter.getEmail().split("@")[0];

        var response = candidateProfileController.getCandidateProfile(emailPrefix);
        assertEquals(400, response.getStatusCode().value());
        
        System.out.println("✅ GET 400 Test: Correctly rejected recruiter " + emailPrefix);
    }

    @Test
    void printSampleUsers() {
        System.out.println("\n📊 Database Population Summary:");
        System.out.println("   Total users: " + userRepository.count());
        
        List<User> candidates = userRepository.findByRole(Role.ROLE_CANDIDATE);
        System.out.println("   Candidates: " + candidates.size());
        
        List<User> recruiters = userRepository.findByRole(Role.ROLE_RECRUITER);  
        System.out.println("   Recruiters: " + recruiters.size());
        
        List<User> admins = userRepository.findByRole(Role.ROLE_ADMIN);
        System.out.println("   Admins: " + admins.size());

        System.out.println("\n🔍 Sample Candidate Users (first 5):");
        candidates.stream().limit(5).forEach(user -> {
            String emailPrefix = user.getEmail().split("@")[0];
            System.out.println("   - " + emailPrefix + " (" + user.getName() + ") - " + user.getRole());
        });

        System.out.println("\n🔍 Sample Recruiter Users (first 3):");
        recruiters.stream().limit(3).forEach(user -> {
            String emailPrefix = user.getEmail().split("@")[0];
            System.out.println("   - " + emailPrefix + " (" + user.getName() + ") - " + user.getRole());
        });
    }
}