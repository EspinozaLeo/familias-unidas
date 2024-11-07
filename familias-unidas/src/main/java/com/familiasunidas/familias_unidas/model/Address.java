package com.familiasunidas.familias_unidas.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Address {
    private String stAddr;
    private String cityAddr;
    private String stateAddr;
    private String zipCode;
    private String countryAddr;

    public Address() {
    }

    public Address(String stAddr, String cityAddr, String stateAddr, String zipCode, String countryAddr) {
        this.stAddr = stAddr;
        this.cityAddr = cityAddr;
        this.stateAddr = stateAddr;
        this.zipCode = zipCode;
        this.countryAddr = countryAddr;
    }

    public String getStAddr() {
        return stAddr;
    }

    public void setStAddr(String stAddr) {
        this.stAddr = stAddr;
    }

    public String getCityAddr() {
        return cityAddr;
    }

    public void setCityAddr(String cityAddr) {
        this.cityAddr = cityAddr;
    }

    public String getStateAddr() {
        return stateAddr;
    }

    public void setStateAddr(String stateAddr) {
        this.stateAddr = stateAddr;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountryAddr() {
        return countryAddr;
    }

    public void setCountryAddr(String countryAddr) {
        this.countryAddr = countryAddr;
    }
}
