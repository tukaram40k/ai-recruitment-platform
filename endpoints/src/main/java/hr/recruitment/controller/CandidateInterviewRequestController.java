package hr.recruitment.controller;

import hr.recruitment.dto.NewInterviewRequestDto;
import hr.recruitment.model.Interview;
import hr.recruitment.model.User;
import hr.recruitment.model.enums.Role;
import hr.recruitment.service.InterviewService;
import hr.recruitment.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CandidateInterviewRequestController {
    
    private final UserService userService;
    private final InterviewService interviewService;
    
    @PostMapping("/{emailPrefix}/new-interview")
    public ResponseEntity<Interview> createInterviewRequest(
            @PathVariable String emailPrefix,
            @Valid @RequestBody NewInterviewRequestDto requestDto) {
        try {
            // Get the candidate user by email prefix
            User candidate = userService.getUserByEmailPrefix(emailPrefix);
            
            // Verify that the user is actually a candidate
            if (candidate.getRole() != Role.ROLE_CANDIDATE) {
                return ResponseEntity.badRequest().build();
            }
            
            // Create new interview with initial score of 0 (not evaluated yet)
            Interview interview = new Interview();
            interview.setUser(candidate);
            interview.setPosition(requestDto.getPosition());
            interview.setScore(0); // Default score for new interview requests
            
            // Save the interview
            Interview createdInterview = interviewService.createInterview(interview);
            
            return new ResponseEntity<>(createdInterview, HttpStatus.CREATED);
            
        } catch (IllegalArgumentException e) {
            // User is not a candidate
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            // User not found
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{emailPrefix}/interviews")
    public ResponseEntity<java.util.List<Interview>> getCandidateInterviews(@PathVariable String emailPrefix) {
        try {
            // Get the candidate user by email prefix
            User candidate = userService.getUserByEmailPrefix(emailPrefix);
            
            // Verify that the user is actually a candidate
            if (candidate.getRole() != Role.ROLE_CANDIDATE) {
                return ResponseEntity.badRequest().build();
            }
            
            // Get all interviews for this candidate
            java.util.List<Interview> interviews = interviewService.getInterviewsByUserId(candidate.getId());
            
            return ResponseEntity.ok(interviews);
            
        } catch (IllegalArgumentException e) {
            // User is not a candidate
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            // User not found
            return ResponseEntity.notFound().build();
        }
    }
}