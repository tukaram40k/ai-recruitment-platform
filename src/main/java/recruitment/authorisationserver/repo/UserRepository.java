// repo/UserRepository.java
package recruitment.authorisationserver.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import recruitment.authorisationserver.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}