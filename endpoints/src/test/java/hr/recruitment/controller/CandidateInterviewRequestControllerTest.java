package hr.recruitment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import hr.recruitment.dto.NewInterviewRequestDto;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CandidateInterviewRequestControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @Mock
    private InterviewService interviewService;

    @InjectMocks
    private CandidateInterviewRequestController candidateInterviewRequestController;

    private ObjectMapper objectMapper;
    private User candidateUser;
    private User recruiterUser;
    private NewInterviewRequestDto interviewRequestDto;
    private Interview interview;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(candidateInterviewRequestController).build();
        objectMapper = new ObjectMapper();

        // Setup test candidate user
        candidateUser = new User();
        candidateUser.setId(1L);
        candidateUser.setName("John Doe");
        candidateUser.setEmail("johndoe@example.com");
        candidateUser.setRole(Role.ROLE_CANDIDATE);
        candidateUser.setInfo("Software Developer");
        candidateUser.setCv("My CV content");

        // Setup test recruiter user (for negative tests)
        recruiterUser = new User();
        recruiterUser.setId(2L);
        recruiterUser.setName("Jane Smith");
        recruiterUser.setEmail("janesmith@example.com");
        recruiterUser.setRole(Role.ROLE_RECRUITER);

        // Setup test interview request DTO
        interviewRequestDto = new NewInterviewRequestDto();
        interviewRequestDto.setPosition("Senior Java Developer");

        // Setup test interview
        interview = new Interview();
        interview.setId(1L);
        interview.setUser(candidateUser);
        interview.setPosition("Senior Java Developer");
        interview.setScore(0);
    }

    @Test
    void createInterviewRequest_Success() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("johndoe")).thenReturn(candidateUser);
        when(interviewService.createInterview(any(Interview.class))).thenReturn(interview);

        // When & Then
        mockMvc.perform(post("/api/candidate/johndoe/new-interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(interviewRequestDto)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.position").value("Senior Java Developer"))
                .andExpect(jsonPath("$.score").value(0))
                .andExpect(jsonPath("$.user.id").value(1))
                .andExpect(jsonPath("$.user.name").value("John Doe"));

        verify(userService).getUserByEmailPrefix("johndoe");
        verify(interviewService).createInterview(any(Interview.class));
    }

    @Test
    void createInterviewRequest_UserNotFound() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("nonexistent"))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(post("/api/candidate/nonexistent/new-interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(interviewRequestDto)))
                .andExpect(status().isNotFound());

        verify(userService).getUserByEmailPrefix("nonexistent");
        verify(interviewService, never()).createInterview(any(Interview.class));
    }

    @Test
    void createInterviewRequest_UserNotCandidate() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("janesmith")).thenReturn(recruiterUser);

        // When & Then
        mockMvc.perform(post("/api/candidate/janesmith/new-interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(interviewRequestDto)))
                .andExpect(status().isBadRequest());

        verify(userService).getUserByEmailPrefix("janesmith");
        verify(interviewService, never()).createInterview(any(Interview.class));
    }

    @Test
    void createInterviewRequest_ValidationError() throws Exception {
        // Given - DTO with blank position (should fail validation)
        NewInterviewRequestDto invalidDto = new NewInterviewRequestDto();
        invalidDto.setPosition(""); // Blank position should fail @NotBlank validation

        // When & Then
        mockMvc.perform(post("/api/candidate/johndoe/new-interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());

        // Verify service was not called due to validation failure
        verify(userService, never()).getUserByEmailPrefix(anyString());
        verify(interviewService, never()).createInterview(any(Interview.class));
    }

    @Test
    void createInterviewRequest_NullPosition() throws Exception {
        // Given - DTO with null position
        NewInterviewRequestDto nullDto = new NewInterviewRequestDto();
        nullDto.setPosition(null);

        // When & Then
        mockMvc.perform(post("/api/candidate/johndoe/new-interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nullDto)))
                .andExpect(status().isBadRequest());

        // Verify service was not called due to validation failure
        verify(userService, never()).getUserByEmailPrefix(anyString());
        verify(interviewService, never()).createInterview(any(Interview.class));
    }

    @Test
    void getCandidateInterviews_Success() throws Exception {
        // Given
        Interview interview2 = new Interview();
        interview2.setId(2L);
        interview2.setUser(candidateUser);
        interview2.setPosition("Full Stack Developer");
        interview2.setScore(85);

        List<Interview> interviews = Arrays.asList(interview, interview2);

        when(userService.getUserByEmailPrefix("johndoe")).thenReturn(candidateUser);
        when(interviewService.getInterviewsByUserId(1L)).thenReturn(interviews);

        // When & Then
        mockMvc.perform(get("/api/candidate/johndoe/interviews"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].position").value("Senior Java Developer"))
                .andExpect(jsonPath("$[0].score").value(0))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].position").value("Full Stack Developer"))
                .andExpect(jsonPath("$[1].score").value(85));

        verify(userService).getUserByEmailPrefix("johndoe");
        verify(interviewService).getInterviewsByUserId(1L);
    }

    @Test
    void getCandidateInterviews_UserNotFound() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("nonexistent"))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(get("/api/candidate/nonexistent/interviews"))
                .andExpect(status().isNotFound());

        verify(userService).getUserByEmailPrefix("nonexistent");
        verify(interviewService, never()).getInterviewsByUserId(anyLong());
    }

    @Test
    void getCandidateInterviews_UserNotCandidate() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("janesmith")).thenReturn(recruiterUser);

        // When & Then
        mockMvc.perform(get("/api/candidate/janesmith/interviews"))
                .andExpect(status().isBadRequest());

        verify(userService).getUserByEmailPrefix("janesmith");
        verify(interviewService, never()).getInterviewsByUserId(anyLong());
    }

    @Test
    void getCandidateInterviews_EmptyList() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("johndoe")).thenReturn(candidateUser);
        when(interviewService.getInterviewsByUserId(1L)).thenReturn(Arrays.asList());

        // When & Then
        mockMvc.perform(get("/api/candidate/johndoe/interviews"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(0));

        verify(userService).getUserByEmailPrefix("johndoe");
        verify(interviewService).getInterviewsByUserId(1L);
    }

    @Test
    void createInterviewRequest_VerifyInterviewObjectCreation() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("johndoe")).thenReturn(candidateUser);
        when(interviewService.createInterview(any(Interview.class))).thenAnswer(invocation -> {
            Interview arg = invocation.getArgument(0);
            arg.setId(1L); // Simulate database ID assignment
            return arg;
        });

        // When & Then
        mockMvc.perform(post("/api/candidate/johndoe/new-interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(interviewRequestDto)))
                .andExpect(status().isCreated());

        // Verify that the interview object was created with correct properties
        verify(interviewService).createInterview(argThat(interview -> 
            interview.getUser().equals(candidateUser) &&
            interview.getPosition().equals("Senior Java Developer") &&
            interview.getScore() == 0
        ));
    }
}