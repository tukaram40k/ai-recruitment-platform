package hr.recruitment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import hr.recruitment.dto.CandidateProfileDto;
import hr.recruitment.dto.UpdateCvDto;
import hr.recruitment.dto.UpdateInfoDto;
import hr.recruitment.model.User;
import hr.recruitment.model.enums.Role;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CandidateProfileControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private CandidateProfileController candidateProfileController;

    private ObjectMapper objectMapper;

    private User candidateUser;
    private User recruiterUser;
    private CandidateProfileDto candidateProfileDto;
    private UpdateInfoDto updateInfoDto;
    private UpdateCvDto updateCvDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(candidateProfileController).build();
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

        // Setup test DTOs
        candidateProfileDto = new CandidateProfileDto();
        candidateProfileDto.setName("Updated John Doe");
        candidateProfileDto.setInfo("Senior Software Developer");
        candidateProfileDto.setCv("Updated CV content");

        updateInfoDto = new UpdateInfoDto();
        updateInfoDto.setInfo("Updated professional info");

        updateCvDto = new UpdateCvDto();
        updateCvDto.setCv("Updated CV");
    }

    @Test
    void getCandidateProfile_Success() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("johndoe")).thenReturn(candidateUser);

        // When & Then
        mockMvc.perform(get("/api/candidate/cabinet/johndoe"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("johndoe@example.com"))
                .andExpect(jsonPath("$.role").value("ROLE_CANDIDATE"))
                .andExpect(jsonPath("$.info").value("Software Developer"))
                .andExpect(jsonPath("$.cv").value("My CV content"));

        verify(userService).getUserByEmailPrefix("johndoe");
    }

    @Test
    void getCandidateProfile_UserNotFound() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("nonexistent"))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(get("/api/candidate/cabinet/nonexistent"))
                .andExpect(status().isNotFound());

        verify(userService).getUserByEmailPrefix("nonexistent");
    }

    @Test
    void getCandidateProfile_UserNotCandidate() throws Exception {
        // Given
        when(userService.getUserByEmailPrefix("janesmith")).thenReturn(recruiterUser);

        // When & Then
        mockMvc.perform(get("/api/candidate/cabinet/janesmith"))
                .andExpect(status().isBadRequest());

        verify(userService).getUserByEmailPrefix("janesmith");
    }

    @Test
    void updateCandidateProfile_Success() throws Exception {
        // Given
        User updatedCandidate = new User();
        updatedCandidate.setId(1L);
        updatedCandidate.setName("Updated John Doe");
        updatedCandidate.setEmail("johndoe@example.com");
        updatedCandidate.setRole(Role.ROLE_CANDIDATE);
        updatedCandidate.setInfo("Senior Software Developer");
        updatedCandidate.setCv("Updated CV content");

        when(userService.updateCandidateProfileByEmailPrefix(eq("johndoe"), any(CandidateProfileDto.class)))
                .thenReturn(updatedCandidate);

        // When & Then
        mockMvc.perform(put("/api/candidate/cabinet/johndoe")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(candidateProfileDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Updated John Doe"))
                .andExpect(jsonPath("$.info").value("Senior Software Developer"))
                .andExpect(jsonPath("$.cv").value("Updated CV content"));

        verify(userService).updateCandidateProfileByEmailPrefix(eq("johndoe"), any(CandidateProfileDto.class));
    }

    @Test
    void updateCandidateProfile_UserNotCandidate() throws Exception {
        // Given
        when(userService.updateCandidateProfileByEmailPrefix(eq("janesmith"), any(CandidateProfileDto.class)))
                .thenThrow(new IllegalArgumentException("User is not a candidate"));

        // When & Then
        mockMvc.perform(put("/api/candidate/cabinet/janesmith")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(candidateProfileDto)))
                .andExpect(status().isBadRequest());

        verify(userService).updateCandidateProfileByEmailPrefix(eq("janesmith"), any(CandidateProfileDto.class));
    }

    @Test
    void updateCandidateProfile_UserNotFound() throws Exception {
        // Given
        when(userService.updateCandidateProfileByEmailPrefix(eq("nonexistent"), any(CandidateProfileDto.class)))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(put("/api/candidate/cabinet/nonexistent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(candidateProfileDto)))
                .andExpect(status().isNotFound());

        verify(userService).updateCandidateProfileByEmailPrefix(eq("nonexistent"), any(CandidateProfileDto.class));
    }

    @Test
    void updateCandidateProfile_ValidationError() throws Exception {
        // Given - DTO with blank name (should fail validation)
        CandidateProfileDto invalidDto = new CandidateProfileDto();
        invalidDto.setName(""); // Blank name should fail @NotBlank validation
        invalidDto.setInfo("Some info");

        // When & Then
        mockMvc.perform(put("/api/candidate/cabinet/johndoe")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());

        // Verify service was not called due to validation failure
        verify(userService, never()).updateCandidateProfileByEmailPrefix(anyString(), any(CandidateProfileDto.class));
    }

    @Test
    void updateCandidateInfo_Success() throws Exception {
        // Given
        User updatedCandidate = new User();
        updatedCandidate.setId(1L);
        updatedCandidate.setName("John Doe");
        updatedCandidate.setEmail("johndoe@example.com");
        updatedCandidate.setRole(Role.ROLE_CANDIDATE);
        updatedCandidate.setInfo("Updated professional info");

        when(userService.updateCandidateInfoByEmailPrefix("johndoe", "Updated professional info"))
                .thenReturn(updatedCandidate);

        // When & Then
        mockMvc.perform(patch("/api/candidate/cabinet/johndoe/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateInfoDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.info").value("Updated professional info"));

        verify(userService).updateCandidateInfoByEmailPrefix("johndoe", "Updated professional info");
    }

    @Test
    void updateCandidateInfo_UserNotCandidate() throws Exception {
        // Given
        when(userService.updateCandidateInfoByEmailPrefix("janesmith", "Updated professional info"))
                .thenThrow(new IllegalArgumentException("User is not a candidate"));

        // When & Then
        mockMvc.perform(patch("/api/candidate/cabinet/janesmith/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateInfoDto)))
                .andExpect(status().isBadRequest());

        verify(userService).updateCandidateInfoByEmailPrefix("janesmith", "Updated professional info");
    }

    @Test
    void updateCandidateInfo_UserNotFound() throws Exception {
        // Given
        when(userService.updateCandidateInfoByEmailPrefix("nonexistent", "Updated professional info"))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(patch("/api/candidate/cabinet/nonexistent/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateInfoDto)))
                .andExpect(status().isNotFound());

        verify(userService).updateCandidateInfoByEmailPrefix("nonexistent", "Updated professional info");
    }

    @Test
    void updateCandidateCV_Success() throws Exception {
        // Given
        User updatedCandidate = new User();
        updatedCandidate.setId(1L);
        updatedCandidate.setName("John Doe");
        updatedCandidate.setEmail("johndoe@example.com");
        updatedCandidate.setRole(Role.ROLE_CANDIDATE);
        updatedCandidate.setCv("Updated CV");

        when(userService.updateCandidateCVByEmailPrefix("johndoe", "Updated CV"))
                .thenReturn(updatedCandidate);

        // When & Then
        mockMvc.perform(patch("/api/candidate/cabinet/johndoe/cv")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateCvDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.cv").value("Updated CV"));

        verify(userService).updateCandidateCVByEmailPrefix("johndoe", "Updated CV");
    }

    @Test
    void updateCandidateCV_UserNotCandidate() throws Exception {
        // Given
        when(userService.updateCandidateCVByEmailPrefix("janesmith", "Updated CV"))
                .thenThrow(new IllegalArgumentException("User is not a candidate"));

        // When & Then
        mockMvc.perform(patch("/api/candidate/cabinet/janesmith/cv")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateCvDto)))
                .andExpect(status().isBadRequest());

        verify(userService).updateCandidateCVByEmailPrefix("janesmith", "Updated CV");
    }

    @Test
    void updateCandidateCV_UserNotFound() throws Exception {
        // Given
        when(userService.updateCandidateCVByEmailPrefix("nonexistent", "Updated CV"))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(patch("/api/candidate/cabinet/nonexistent/cv")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateCvDto)))
                .andExpect(status().isNotFound());

        verify(userService).updateCandidateCVByEmailPrefix("nonexistent", "Updated CV");
    }

    @Test
    void updateCandidateCV_NullCvValue() throws Exception {
        // Given
        UpdateCvDto nullCvDto = new UpdateCvDto();
        nullCvDto.setCv(null);

        User updatedCandidate = new User();
        updatedCandidate.setId(1L);
        updatedCandidate.setName("John Doe");
        updatedCandidate.setEmail("johndoe@example.com");
        updatedCandidate.setRole(Role.ROLE_CANDIDATE);
        updatedCandidate.setCv(null);

        when(userService.updateCandidateCVByEmailPrefix("johndoe", null))
                .thenReturn(updatedCandidate);

        // When & Then
        mockMvc.perform(patch("/api/candidate/cabinet/johndoe/cv")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nullCvDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.cv").isEmpty());

        verify(userService).updateCandidateCVByEmailPrefix("johndoe", null);
    }

    @Test
    void updateCandidateInfo_NullInfoValue() throws Exception {
        // Given
        UpdateInfoDto nullInfoDto = new UpdateInfoDto();
        nullInfoDto.setInfo(null);

        User updatedCandidate = new User();
        updatedCandidate.setId(1L);
        updatedCandidate.setName("John Doe");
        updatedCandidate.setEmail("johndoe@example.com");
        updatedCandidate.setRole(Role.ROLE_CANDIDATE);
        updatedCandidate.setInfo(null);

        when(userService.updateCandidateInfoByEmailPrefix("johndoe", null))
                .thenReturn(updatedCandidate);

        // When & Then
        mockMvc.perform(patch("/api/candidate/cabinet/johndoe/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nullInfoDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.info").isEmpty());

        verify(userService).updateCandidateInfoByEmailPrefix("johndoe", null);
    }
}