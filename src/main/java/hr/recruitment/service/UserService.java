package hr.recruitment.service;

import hr.recruitment.dto.CandidateProfileDto;
import hr.recruitment.model.User;
import hr.recruitment.model.enums.Role;
import hr.recruitment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        if (userDetails.getName() != null) {
            user.setName(userDetails.getName());
        }
        if (userDetails.getEmail() != null) {
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }
        if (userDetails.getInfo() != null) {
            user.setInfo(userDetails.getInfo());
        }
        if (userDetails.getCv() != null) {
            user.setCv(userDetails.getCv());
        }
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
    
    public User updateCandidateProfile(Long candidateId, CandidateProfileDto profileDto) {
        User candidate = getUserById(candidateId);
        
        // Verify that the user is actually a candidate
        if (candidate.getRole() != Role.ROLE_CANDIDATE) {
            throw new IllegalArgumentException("User is not a candidate");
        }
        
        candidate.setName(profileDto.getName());
        if (profileDto.getInfo() != null) {
            candidate.setInfo(profileDto.getInfo());
        }
        if (profileDto.getCv() != null) {
            candidate.setCv(profileDto.getCv());
        }
        
        return userRepository.save(candidate);
    }
    
    public User updateCandidateInfo(Long candidateId, String info) {
        User candidate = getUserById(candidateId);
        
        // Verify that the user is actually a candidate
        if (candidate.getRole() != Role.ROLE_CANDIDATE) {
            throw new IllegalArgumentException("User is not a candidate");
        }
        
        candidate.setInfo(info);
        return userRepository.save(candidate);
    }
    
    public User updateCandidateCV(Long candidateId, String cv) {
        User candidate = getUserById(candidateId);
        
        // Verify that the user is actually a candidate
        if (candidate.getRole() != Role.ROLE_CANDIDATE) {
            throw new IllegalArgumentException("User is not a candidate");
        }
        
        candidate.setCv(cv);
        return userRepository.save(candidate);
    }
    
    // Methods for working with email prefixes
    public User getUserByEmailPrefix(String emailPrefix) {
        return userRepository.findByEmailStartingWith(emailPrefix + "@")
            .orElseThrow(() -> new RuntimeException("User not found with email prefix: " + emailPrefix));
    }
    
    public User updateCandidateProfileByEmailPrefix(String emailPrefix, CandidateProfileDto profileDto) {
        User candidate = getUserByEmailPrefix(emailPrefix);
        
        // Verify that the user is actually a candidate
        if (candidate.getRole() != Role.ROLE_CANDIDATE) {
            throw new IllegalArgumentException("User is not a candidate");
        }
        
        candidate.setName(profileDto.getName());
        if (profileDto.getInfo() != null) {
            candidate.setInfo(profileDto.getInfo());
        }
        if (profileDto.getCv() != null) {
            candidate.setCv(profileDto.getCv());
        }
        
        return userRepository.save(candidate);
    }
    
    public User updateCandidateInfoByEmailPrefix(String emailPrefix, String info) {
        User candidate = getUserByEmailPrefix(emailPrefix);
        
        // Verify that the user is actually a candidate
        if (candidate.getRole() != Role.ROLE_CANDIDATE) {
            throw new IllegalArgumentException("User is not a candidate");
        }
        
        candidate.setInfo(info);
        return userRepository.save(candidate);
    }
    
    public User updateCandidateCVByEmailPrefix(String emailPrefix, String cv) {
        User candidate = getUserByEmailPrefix(emailPrefix);
        
        // Verify that the user is actually a candidate
        if (candidate.getRole() != Role.ROLE_CANDIDATE) {
            throw new IllegalArgumentException("User is not a candidate");
        }
        
        candidate.setCv(cv);
        return userRepository.save(candidate);
    }
}
