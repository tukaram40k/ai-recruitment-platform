package hr.recruitment.controller;

import hr.recruitment.dto.RecruiterCandidateViewDto;
import hr.recruitment.model.Interview;
import hr.recruitment.model.User;
import hr.recruitment.model.enums.Role;
import hr.recruitment.service.InterviewService;
import hr.recruitment.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecruiterController {
    
    private final UserService userService;
    private final InterviewService interviewService;
    
    @GetMapping("/{emailPrefix}/candidates")
    public ResponseEntity<List<RecruiterCandidateViewDto>> getScoredCandidates(@PathVariable String emailPrefix) {
        try {
            // Get the recruiter user by email prefix
            User recruiter = userService.getUserByEmailPrefix(emailPrefix);
            
            // Verify that the user is actually a recruiter
            if (recruiter.getRole() != Role.ROLE_RECRUITER) {
                return ResponseEntity.badRequest().build();
            }
            
            // Get all interviews that have been scored (by any recruiter)
            List<Interview> scoredInterviews = interviewService.getScoredInterviews();
            
            // Convert to DTO for front-end consumption
            List<RecruiterCandidateViewDto> candidateViews = scoredInterviews.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(candidateViews);
            
        } catch (RuntimeException e) {
            // User not found
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{emailPrefix}/all-interviews")
    public ResponseEntity<List<RecruiterCandidateViewDto>> getAllInterviews(@PathVariable String emailPrefix) {
        try {
            // Get the recruiter user by email prefix
            User recruiter = userService.getUserByEmailPrefix(emailPrefix);
            
            // Verify that the user is actually a recruiter
            if (recruiter.getRole() != Role.ROLE_RECRUITER) {
                return ResponseEntity.badRequest().build();
            }
            
            // Get all interviews in the system (scored and unscored)
            List<Interview> allInterviews = interviewService.getAllInterviews();
            
            // Convert to DTO for front-end consumption
            List<RecruiterCandidateViewDto> candidateViews = allInterviews.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(candidateViews);
            
        } catch (RuntimeException e) {
            // User not found
            return ResponseEntity.notFound().build();
        }
    }
    
    private RecruiterCandidateViewDto convertToDto(Interview interview) {
        RecruiterCandidateViewDto dto = new RecruiterCandidateViewDto();
        dto.setInterviewId(interview.getId());
        dto.setCandidateId(interview.getUser().getId());
        dto.setCandidateName(interview.getUser().getName());
        dto.setCandidateEmail(interview.getUser().getEmail());
        dto.setPosition(interview.getPosition());
        dto.setScore(interview.getScore());
        dto.setCandidateInfo(interview.getUser().getInfo());
        dto.setCandidateCv(interview.getUser().getCv());
        return dto;
    }
}