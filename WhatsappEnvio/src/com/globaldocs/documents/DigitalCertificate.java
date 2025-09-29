package com.globaldocs.documents;

public class DigitalCertificate extends AbstractDocument {
    public DigitalCertificate(String format) {
        super("Certificado Digital", format);
    }

    @Override
    public void process() {
        logProcess();
        System.out.println("🔐 Procesando Certificado Digital...");
    }

    @Override
    public void validate(String country) {
        System.out.println("✔ Validando Certificado Digital según regulaciones de " + country);
    }

    @Override
    public void handleError() {
        System.out.println("❌ Error en el procesamiento de Certificado Digital.");
    }
}
