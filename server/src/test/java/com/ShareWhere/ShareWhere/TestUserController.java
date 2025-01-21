package com.ShareWhere.ShareWhere;

import com.ShareWhere.ShareWhere.controllers.UserController;
import com.ShareWhere.ShareWhere.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UserController.class)
public class TestUserController {

    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    public TestUserController(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

//    @Test
//    public void shouldReturnUserGetById() throws Exception {
//        when(userService.getUserById(1)).thenReturn(new User());
//
//        mockMvc.perform(get("/users/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.name").value(""))
//
//    }
}
