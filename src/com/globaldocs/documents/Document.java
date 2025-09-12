package com.globaldocs.documents;

public interface Document {
    void process();
    void validate(String country);
    void handleError();
}
