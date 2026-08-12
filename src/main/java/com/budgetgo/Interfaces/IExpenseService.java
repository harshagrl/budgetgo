package com.budgetgo.Interfaces;

import com.budgetgo.Models.Expense;

import java.util.List;

public interface IExpenseService {
    public List<Expense> getAllExpenses();

    public Expense addNewExpense(Expense expense);

    public void removeExpense(Integer id);
    public Expense updateExpense(Expense expense);
}
