package com.globaldocs.documents;

public class TaxDeclaration extends AbstractDocument {
    public TaxDeclaration(String format) {
        super("Declaración Tributaria", format);
    }

    @Override
    public void process() {
        logProcess();
        System.out.println("💰 Procesando Declaración Tributaria...");
    }

    @Override
    public void validate(String country) {
        System.out.println("✔ Validando Declaración Tributaria según regulaciones de " + country);
    }

    @Override
    public void handleError() {
        System.out.println("❌ Error en el procesamiento de Declaración Tributaria.");
    }
}
