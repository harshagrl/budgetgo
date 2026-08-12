package com.budgetgo.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to the BudgetGo API! \n" +
               "Endpoints available:\n" +
               "- /expenses (GET, POST, PUT, DELETE)\n" +
               "- /income (GET, POST, PUT, DELETE)\n" +
               "Database console available at /h2-console";
    }
}
