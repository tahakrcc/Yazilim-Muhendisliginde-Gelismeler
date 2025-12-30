package com.pazar.backend.entity.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;

@Document(collection = "markets")
public class Market {
    @Id
    private String id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Boolean isOpenToday;
    private String openingHours;
    private Map<String, Object> map2D;
    private Map<String, Object> map3D;

    public Market() {}

    public Market(String id, String name, String address, Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.isOpenToday = true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Boolean getIsOpenToday() { return isOpenToday; }
    public void setIsOpenToday(Boolean isOpenToday) { this.isOpenToday = isOpenToday; }

    public String getOpeningHours() { return openingHours; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }

    public Map<String, Object> getMap2D() { return map2D; }
    public void setMap2D(Map<String, Object> map2D) { this.map2D = map2D; }

    public Map<String, Object> getMap3D() { return map3D; }
    public void setMap3D(Map<String, Object> map3D) { this.map3D = map3D; }
}
