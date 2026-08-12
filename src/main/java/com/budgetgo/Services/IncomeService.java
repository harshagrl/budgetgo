package com.budgetgo.Services;

import com.budgetgo.Data.IIncomeRepository;
import com.budgetgo.Interfaces.IIncomeService;

import com.budgetgo.Exceptions.ResourceNotFoundException;
import com.budgetgo.Models.Income;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncomeService implements IIncomeService {
    private final IIncomeRepository repository;
    public IncomeService(IIncomeRepository repo) {
        this.repository = repo;
    }
    @Override
    public List<Income> getAllIncomes() {
        return repository.findAll();
    }
    @Override
    public Income addNewIncome(Income income) {
        return repository.save(income);
    }

    @Override
    public void removeIncome(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Income not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public Income updateIncome(Income income) {
        Optional<Income> currIncome = repository.findById(income.getId());
        if (currIncome.isPresent()) {
            Income fetchedIncome = currIncome.get();
            fetchedIncome.setAmount(income.getAmount());
            fetchedIncome.setName(income.getName());
            fetchedIncome.setCategory(income.getCategory());
            return repository.save(fetchedIncome);
        } else {
            throw new ResourceNotFoundException("Income not found with id: " + income.getId());
        }
    }
}
