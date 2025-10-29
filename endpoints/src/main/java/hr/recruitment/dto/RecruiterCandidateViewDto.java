package hr.recruitment.dto;

import lombok.Data;

@Data
public class RecruiterCandidateViewDto {
    private Long interviewId;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String position;
    private int score;
    private String candidateInfo;
    private String candidateCv;
}