package com.globaldocs.factory;

import com.globaldocs.documents.*;

public class ConcreteDocumentFactory extends DocumentProcessorFactory {
    @Override
    public Document createDocument(String type, String format) {
        switch (type.toLowerCase()) {
            case "factura":
                return new Invoice(format);
            case "contrato":
                return new LegalContract(format);
            case "reporte":
                return new FinancialReport(format);
            case "certificado":
                return new DigitalCertificate(format);
            case "declaracion":
                return new TaxDeclaration(format);
            default:
                return null;
        }
    }
}
