package com.globaldocs.factory;

import com.globaldocs.documents.Document;

public abstract class DocumentProcessorFactory {
    public abstract Document createDocument(String type, String format);

    public void processDocument(String type, String country, String format) {
        Document doc = createDocument(type, format);
        if (doc != null) {
            doc.process();
            doc.validate(country);
        } else {
            System.out.println("⚠ Tipo de documento no soportado.");
        }
    }
}
