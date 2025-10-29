package recruitment.authorisationserver.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import recruitment.authorisationserver.entities.Client;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByClientId(String cliendId);
}
