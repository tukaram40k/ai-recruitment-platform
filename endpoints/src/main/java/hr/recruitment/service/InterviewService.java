package hr.recruitment.service;

import hr.recruitment.model.Interview;
import hr.recruitment.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {
    
    private final InterviewRepository interviewRepository;
    
    public Interview createInterview(Interview interview) {
        return interviewRepository.save(interview);
    }
    
    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }
    
    public Interview getInterviewById(Long id) {
        return interviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Interview not found with id: " + id));
    }
    
    public List<Interview> getInterviewsByUserId(Long userId) {
        return interviewRepository.findByUserId(userId);
    }
    
    public List<Interview> getScoredInterviews() {
        // Get all interviews that have been scored (score > 0)
        return interviewRepository.findByScoreGreaterThan(0);
    }
    
    public Interview updateInterview(Long id, Interview interviewDetails) {
        Interview interview = getInterviewById(id);
        interview.setUser(interviewDetails.getUser());
        interview.setScore(interviewDetails.getScore());
        interview.setPosition(interviewDetails.getPosition());
        
        return interviewRepository.save(interview);
    }
    
    public Interview updateScore(Long id, int score) {
        Interview interview = getInterviewById(id);
        interview.setScore(score);
        
        return interviewRepository.save(interview);
    }
    
    public void deleteInterview(Long id) {
        Interview interview = getInterviewById(id);
        interviewRepository.delete(interview);
    }
}
