package hr.recruitment.controller;

import hr.recruitment.dto.CandidateProfileDto;
import hr.recruitment.dto.UpdateCvDto;
import hr.recruitment.dto.UpdateInfoDto;
import hr.recruitment.model.User;
import hr.recruitment.model.enums.Role;
import hr.recruitment.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidate/cabinet")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CandidateProfileController {
    
    private final UserService userService;
    
    @GetMapping("/{emailPrefix}")
    public ResponseEntity<User> getCandidateProfile(@PathVariable String emailPrefix) {
        try {
            User candidate = userService.getUserByEmailPrefix(emailPrefix);
            
            // Verify that the user is actually a candidate
            if (candidate.getRole() != Role.ROLE_CANDIDATE) {
                return ResponseEntity.badRequest().build();
            }
            
            return ResponseEntity.ok(candidate);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{emailPrefix}")
    public ResponseEntity<User> updateCandidateProfile(
            @PathVariable String emailPrefix,
            @Valid @RequestBody CandidateProfileDto profileDto) {
        try {
            User updatedCandidate = userService.updateCandidateProfileByEmailPrefix(emailPrefix, profileDto);
            return ResponseEntity.ok(updatedCandidate);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{emailPrefix}/info")
    public ResponseEntity<User> updateCandidateInfo(
            @PathVariable String emailPrefix,
            @RequestBody UpdateInfoDto updateInfoDto) {
        try {
            User updatedCandidate = userService.updateCandidateInfoByEmailPrefix(emailPrefix, updateInfoDto.getInfo());
            return ResponseEntity.ok(updatedCandidate);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{emailPrefix}/cv")
    public ResponseEntity<User> updateCandidateCV(
            @PathVariable String emailPrefix,
            @RequestBody UpdateCvDto updateCvDto) {
        try {
            User updatedCandidate = userService.updateCandidateCVByEmailPrefix(emailPrefix, updateCvDto.getCv());
            return ResponseEntity.ok(updatedCandidate);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}