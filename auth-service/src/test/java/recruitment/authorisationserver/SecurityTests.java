package recruitment.authorisationserver;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityTests {
    private static final String ACCESS_TOKEN_ENDPOINT = "/oauth2/token";

    @Autowired
    MockMvc mockMvc;

    @Test
    public void getAccessTokenFail() throws Exception {
        mockMvc.perform(post(ACCESS_TOKEN_ENDPOINT)
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("grant_type", "client_credentials")
                        .param("client_id", "abcdef")
                        .param("client_secret", "1234556")
                )
                .andDo(print())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", is("invalid_client")));
    }

    @Test
    public void getAccessTokenSuccess() throws Exception {
        mockMvc.perform(post(ACCESS_TOKEN_ENDPOINT)
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("grant_type", "client_credentials")
                        .param("client_id", "client-2")
                        .param("client_secret", "password-2")
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").isString())
                .andExpect(jsonPath("$.expires_in").isNumber())
                .andExpect(jsonPath("$.token_type", is("Bearer")));
    }
}
