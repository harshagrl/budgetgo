package com.budgetgo.Controllers;

import com.budgetgo.Interfaces.IExpenseService;
import com.budgetgo.Models.Expense;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {
    private final IExpenseService expenseService;
    public ExpenseController(IExpenseService service){
        this.expenseService = service;
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getExpensesList(){
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }
    @PostMapping("/addExpense")
    public ResponseEntity<Expense> addExpense(@Valid @RequestBody Expense newExpense){
        return new ResponseEntity<>(expenseService.addNewExpense(newExpense), HttpStatus.CREATED);
    }
    @DeleteMapping("/removeExpense/{id}")
    public ResponseEntity<Void> removeExpense(@PathVariable Integer id){
        expenseService.removeExpense(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping
    public ResponseEntity<Expense> updateExpense(@Valid @RequestBody Expense expense){
        return ResponseEntity.ok(expenseService.updateExpense(expense));
    }

}
