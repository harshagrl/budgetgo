package com.budgetgo.Services;

import com.budgetgo.Data.IExpenseRepository;
import com.budgetgo.Interfaces.IExpenseService;
import com.budgetgo.Exceptions.ResourceNotFoundException;
import com.budgetgo.Models.Expense;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService implements IExpenseService {
    private final IExpenseRepository repository;

    public ExpenseService(IExpenseRepository repo) {
        this.repository = repo;
    }

    @Override
    public List<Expense> getAllExpenses() {
        return repository.findAll();
    }

    @Override
    public Expense addNewExpense(Expense expense) {
        return repository.save(expense);
    }

    @Override
    public void removeExpense(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public Expense updateExpense(Expense expense) {
        Optional<Expense> currExpense = repository.findById(expense.getId());
        if (currExpense.isPresent()) {
            Expense fetchedExpense = currExpense.get();
            fetchedExpense.setAmount(expense.getAmount());
            fetchedExpense.setName(expense.getName());
            fetchedExpense.setCategory(expense.getCategory());
            return repository.save(fetchedExpense);
        } else {
            throw new ResourceNotFoundException("Expense not found with id: " + expense.getId());
        }
    }

}
