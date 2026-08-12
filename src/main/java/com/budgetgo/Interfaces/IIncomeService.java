package com.budgetgo.Interfaces;

import com.budgetgo.Models.Income;

import java.util.List;

public interface IIncomeService {

    public List<Income> getAllIncomes();
    public Income addNewIncome(Income income);
    public void removeIncome(Integer id);
    public Income updateIncome(Income income);
}
