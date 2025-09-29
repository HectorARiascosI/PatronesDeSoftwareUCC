package com.globaldocs.documents;

public class FinancialReport extends AbstractDocument {
    public FinancialReport(String format) {
        super("Reporte Financiero", format);
    }

    @Override
    public void process() {
        logProcess();
        System.out.println("📊 Procesando Reporte Financiero...");
    }

    @Override
    public void validate(String country) {
        System.out.println("✔ Validando Reporte Financiero según regulaciones de " + country);
    }

    @Override
    public void handleError() {
        System.out.println("❌ Error en el procesamiento de Reporte Financiero.");
    }
}
