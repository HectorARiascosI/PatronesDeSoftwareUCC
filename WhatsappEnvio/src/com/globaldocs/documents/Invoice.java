package com.globaldocs.documents;

public class Invoice extends AbstractDocument {
    public Invoice(String format) {
        super("Factura Electrónica", format);
    }

    @Override
    public void process() {
        logProcess();
        System.out.println("📄 Procesando Factura Electrónica...");
    }

    @Override
    public void validate(String country) {
        System.out.println("✔ Validando Factura según regulaciones de " + country);
    }

    @Override
    public void handleError() {
        System.out.println("❌ Error en el procesamiento de Factura.");
    }
}
