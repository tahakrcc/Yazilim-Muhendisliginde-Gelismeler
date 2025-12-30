package com.pazar.backend.entity.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String category;
    private String unit;
    private String freshness;

    public Product() {}

    public Product(String id, String name, String category, String unit, String freshness) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.unit = unit;
        this.freshness = freshness;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getFreshness() { return freshness; }
    public void setFreshness(String freshness) { this.freshness = freshness; }
}
