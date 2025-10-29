package hr.recruitment.controller;

import hr.recruitment.model.Interview;
import hr.recruitment.model.User;
import hr.recruitment.model.enums.Role;
import hr.recruitment.service.InterviewService;
import hr.recruitment.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class RecruiterControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @Mock
    private InterviewService interviewService;

    @InjectMocks
    private RecruiterController recruiterController;

    private User recruiterUser;
    private User candidateUser;
    private User adminUser;
    private Interview scoredInterview;
    private Interview unscoredInterview;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(recruiterController).build();

        // Setup test recruiter user
        recruiterUser = new User();
        recruiterUser.setId(2L);
        recruiterUser.setName("Jane Smith");
        recruiterUser.setEmail("janesmith@example.com");
        recruiterUser.setRole(Role.ROLE_RECRUITER);
        recruiterUser.setInfo("Senior Recruiter with 5 years experience");

        // Setup test candidate user
        candidateUser = new User();
        candidateUser.setId(1L);
        candidateUser.setName("John Doe");
        candidateUser.setEmail("johndoe@example.com");
        candidateUser.setRole(Role.ROLE_CANDIDATE);
        candidateUser.setInfo("Software Developer");
        candidateUser.setCv("Experienced Java developer with 3 years experience");

        // Setup test admin user (for negative tests)
        adminUser = new User();
        adminUser.setId(3L);
        adminUser.setName("Admin User");
        adminUser.setEmail("admin@example.com");
        adminUser.setRole(Role.ROLE_ADMIN);

        // Setup test interviews
        scoredInterview = new Interview();
        scoredInterview.setId(1L);
        scoredInterview.setUser(candidateUser);
        scoredInterview.setPosition("Senior Java Developer");
        scoredInterview.setScore(85);

        unscoredInterview = new Interview();
        unscoredInterview.setId(2L);
        unscoredInterview.setUser(candidateUser);
        unscoredInterview.setPosition("Full Stack Developer");
        unscoredInterview.setScore(0);
    }

    @Test
    void getScoredCandidates_Success() throws Exception {
        // Given
        List<Interview> scoredInterviews = Arrays.asList(scoredInterview);
        when(userService.getUserByEmailPrefix("janesmith")).thenReturn(recruiterUser);
        when(interviewService.getScoredInterviews()).thenReturn(scoredInterviews);

        // When & Then
        mockMvc.perform(get("/api/recruiter/janesmith/candidates"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].interviewId").value(1))
                .andExpect(jsonPath("$[0].candidateId").value(1))
                .andExpect(jsonPath("$[0].candidateName").value("John Doe"))
                .andExpect(jsonPath("$[0].candidateEmail").value("johndoe@example.com"))
                .andExpect(jsonPath("$[0].position").value("Senior Java Developer"))
                .andExpect(jsonPath("$[0].score").value(85))
                .andExpect(jsonPath("$[0].candidateInfo").value("Software Developer"))
                .andExpect(jsonPath("$[0].candidateCv").value("Experienced Java developer with 3 years experience"));

        verify(userService).getUserByEmailPrefix("janesmith");
        verify(interviewService).getScoredInterviews();
    }

    @Test
    void getScoredCandidates_UserNotFound() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("nonexistent"))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(get("/api/recruiter/nonexistent/candidates"))
                .andExpect(status().isNotFound());

        verify(userService).getUserByEmailPrefix("nonexistent");
        verify(interviewService, never()).getScoredInterviews();
    }

    @Test
    void getScoredCandidates_UserNotRecruiter() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("admin")).thenReturn(adminUser);

        // When & Then
        mockMvc.perform(get("/api/recruiter/admin/candidates"))
                .andExpect(status().isBadRequest());

        verify(userService).getUserByEmailPrefix("admin");
        verify(interviewService, never()).getScoredInterviews();
    }

    @Test
    void getScoredCandidates_EmptyList() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("janesmith")).thenReturn(recruiterUser);
        when(interviewService.getScoredInterviews()).thenReturn(Arrays.asList());

        // When & Then
        mockMvc.perform(get("/api/recruiter/janesmith/candidates"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(0));

        verify(userService).getUserByEmailPrefix("janesmith");
        verify(interviewService).getScoredInterviews();
    }

    @Test
    void getAllInterviews_Success() throws Exception {
        // Given
        List<Interview> allInterviews = Arrays.asList(scoredInterview, unscoredInterview);
        when(userService.getUserByEmailPrefix("janesmith")).thenReturn(recruiterUser);
        when(interviewService.getAllInterviews()).thenReturn(allInterviews);

        // When & Then
        mockMvc.perform(get("/api/recruiter/janesmith/all-interviews"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].interviewId").value(1))
                .andExpect(jsonPath("$[0].score").value(85))
                .andExpect(jsonPath("$[1].interviewId").value(2))
                .andExpect(jsonPath("$[1].score").value(0));

        verify(userService).getUserByEmailPrefix("janesmith");
        verify(interviewService).getAllInterviews();
    }

    @Test
    void getAllInterviews_UserNotFound() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("nonexistent"))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(get("/api/recruiter/nonexistent/all-interviews"))
                .andExpect(status().isNotFound());

        verify(userService).getUserByEmailPrefix("nonexistent");
        verify(interviewService, never()).getAllInterviews();
    }

    @Test
    void getAllInterviews_UserNotRecruiter() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("johndoe")).thenReturn(candidateUser);

        // When & Then
        mockMvc.perform(get("/api/recruiter/johndoe/all-interviews"))
                .andExpect(status().isBadRequest());

        verify(userService).getUserByEmailPrefix("johndoe");
        verify(interviewService, never()).getAllInterviews();
    }

    @Test
    void getAllInterviews_MultipleCandidates() throws Exception {
        // Given - Create another candidate and interview
        User anotherCandidate = new User();
        anotherCandidate.setId(4L);
        anotherCandidate.setName("Alice Johnson");
        anotherCandidate.setEmail("alice@example.com");
        anotherCandidate.setRole(Role.ROLE_CANDIDATE);
        anotherCandidate.setInfo("Frontend Developer");
        anotherCandidate.setCv("React specialist with 2 years experience");

        Interview anotherInterview = new Interview();
        anotherInterview.setId(3L);
        anotherInterview.setUser(anotherCandidate);
        anotherInterview.setPosition("React Developer");
        anotherInterview.setScore(75);

        List<Interview> multipleInterviews = Arrays.asList(scoredInterview, anotherInterview);
        when(userService.getUserByEmailPrefix("janesmith")).thenReturn(recruiterUser);
        when(interviewService.getAllInterviews()).thenReturn(multipleInterviews);

        // When & Then
        mockMvc.perform(get("/api/recruiter/janesmith/all-interviews"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].candidateName").value("John Doe"))
                .andExpect(jsonPath("$[1].candidateName").value("Alice Johnson"))
                .andExpect(jsonPath("$[0].position").value("Senior Java Developer"))
                .andExpect(jsonPath("$[1].position").value("React Developer"));

        verify(userService).getUserByEmailPrefix("janesmith");
        verify(interviewService).getAllInterviews();
    }
}