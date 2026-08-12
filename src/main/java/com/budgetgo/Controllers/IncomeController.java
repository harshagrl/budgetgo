package com.budgetgo.Controllers;

import com.budgetgo.Interfaces.IIncomeService;

import com.budgetgo.Models.Income;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/income")
@CrossOrigin(origins = "*")
public class IncomeController {
    private final IIncomeService incomeService;

    public IncomeController(IIncomeService service) {
        this.incomeService = service;
    }

    @GetMapping
    public ResponseEntity<List<Income>> getIncomesList() {
        return ResponseEntity.ok(incomeService.getAllIncomes());
    }

    @PostMapping("/addIncome")
    public ResponseEntity<Income> addIncome(@Valid @RequestBody Income newIncome) {
        return new ResponseEntity<>(incomeService.addNewIncome(newIncome), HttpStatus.CREATED);
    }

    @DeleteMapping("/removeIncome/{id}")
    public ResponseEntity<Void> removeIncome(@PathVariable Integer id) {
        incomeService.removeIncome(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<Income> updateIncome(@Valid @RequestBody Income income) {
        return ResponseEntity.ok(incomeService.updateIncome(income));
    }

}
