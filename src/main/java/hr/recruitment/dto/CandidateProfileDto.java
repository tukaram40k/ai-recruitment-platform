package hr.recruitment.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class CandidateProfileDto {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String info;
    
    private String cv;
}