package com.globaldocs.documents;

public class LegalContract extends AbstractDocument {
    public LegalContract(String format) {
        super("Contrato Legal", format);
    }

    @Override
    public void process() {
        logProcess();
        System.out.println("📑 Procesando Contrato Legal...");
    }

    @Override
    public void validate(String country) {
        System.out.println("✔ Validando Contrato Legal según regulaciones de " + country);
    }

    @Override
    public void handleError() {
        System.out.println("❌ Error en el procesamiento de Contrato Legal.");
    }
}
