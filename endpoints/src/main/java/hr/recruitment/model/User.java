package hr.recruitment.model;

import jakarta.persistence.*;
import lombok.Data;
import hr.recruitment.model.enums.Role;
import java.util.List;

@Data
@Entity
@Table( name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String info;

    private String cv; // Only necessary for candidates, but nullable for other roles

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Interview> interviews;

}
