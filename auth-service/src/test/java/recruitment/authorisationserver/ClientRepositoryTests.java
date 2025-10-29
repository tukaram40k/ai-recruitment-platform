package recruitment.authorisationserver;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import recruitment.authorisationserver.entities.Client;
import recruitment.authorisationserver.repo.ClientRepository;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
public class ClientRepositoryTests {

    @Autowired
    ClientRepository clientRepository;

    @Test
    public void testAddClient() {
        Client client = new Client();
        client.setClientId("client-2");
        client.setName("Max Costov");

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String rawSecret = "password-2";
        client.setClientSecret(passwordEncoder.encode(rawSecret));
        client.setScope("read");

        Client c = clientRepository.save(client);

        assertThat(c.getId()).isNotNull();
    }


    @Test
    public void testFindByClientId() {
        String clientId = "client-1";
        Optional<Client> findResult = clientRepository.findByClientId(clientId);

        assertThat(findResult.isPresent()).isTrue();
    }

}
