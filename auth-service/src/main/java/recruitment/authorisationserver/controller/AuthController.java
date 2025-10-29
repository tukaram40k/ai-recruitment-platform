// controller/AuthController.java
package recruitment.authorisationserver.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import recruitment.authorisationserver.dto.AuthResponse;
import recruitment.authorisationserver.dto.RegisterRequest;
import recruitment.authorisationserver.entities.User;
import recruitment.authorisationserver.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // URL вашего React приложения
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(registerRequest);
            return ResponseEntity.ok(new AuthResponse(true, "User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<Boolean> checkUsernameAvailability(@PathVariable String username) {
        boolean available = !userService.userRepository.existsByUsername(username);
        return ResponseEntity.ok(available);
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailAvailability(@PathVariable String email) {
        boolean available = !userService.userRepository.existsByEmail(email);
        return ResponseEntity.ok(available);
    }
}