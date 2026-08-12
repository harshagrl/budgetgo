package com.budgetgo.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "expense")
@Data
@AllArgsConstructor
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotNull(message = "Amount cannot be null")
    @Min(value = 0, message = "Amount must be positive")
    private Double amount;
    
    @NotBlank(message = "Name cannot be empty")
    private String name;
    
    @NotBlank(message = "Category cannot be empty")
    private String category;
    
    @NotNull(message = "Date cannot be null")
    private Date date;
    
    public Expense() {}
}
