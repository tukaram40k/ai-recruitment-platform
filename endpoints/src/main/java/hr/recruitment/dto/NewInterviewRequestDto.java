package hr.recruitment.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class NewInterviewRequestDto {
    @NotBlank(message = "Position is required")
    private String position;
}
