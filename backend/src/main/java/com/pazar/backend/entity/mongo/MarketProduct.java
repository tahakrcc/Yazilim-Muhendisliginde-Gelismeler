package com.pazar.backend.entity.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "market_products")
public class MarketProduct {
    @Id
    private String id;
    private String marketId;
    private String productId;
    private Double price;
    private String stallNumber;
    private Integer x;
    private Integer y;
    private Integer z;
    private String vendorName;

    public MarketProduct() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getMarketId() { return marketId; }
    public void setMarketId(String marketId) { this.marketId = marketId; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getStallNumber() { return stallNumber; }
    public void setStallNumber(String stallNumber) { this.stallNumber = stallNumber; }

    public Integer getX() { return x; }
    public void setX(Integer x) { this.x = x; }

    public Integer getY() { return y; }
    public void setY(Integer y) { this.y = y; }

    public Integer getZ() { return z; }
    public void setZ(Integer z) { this.z = z; }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }
}
