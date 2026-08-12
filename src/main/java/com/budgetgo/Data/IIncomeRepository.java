package com.budgetgo.Data;

import com.budgetgo.Models.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IIncomeRepository extends JpaRepository<Income, Integer> {

}
