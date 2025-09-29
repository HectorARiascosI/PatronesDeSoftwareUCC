package com.globaldocs.app;

import com.globaldocs.factory.*;
import java.util.*;

public class GlobalDocsApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        DocumentProcessorFactory factory = new ConcreteDocumentFactory();

        System.out.println("🌍 Bienvenido al Sistema de Procesamiento de Documentos GlobalDocs");
        System.out.println("Países soportados: Colombia, México, Argentina, Chile");
        System.out.println("Tipos de documentos: Factura, Contrato, Reporte, Certificado, Declaracion");
        System.out.println("Formatos soportados: .pdf, .doc, .docx, .md, .csv, .txt, .xlsx");
        System.out.println("----------------------------------------------------");

        while (true) {
            System.out.print("\nIngrese el país (o 'salir' para terminar): ");
            String country = scanner.nextLine();
            if (country.equalsIgnoreCase("salir")) break;

            System.out.print("Ingrese el tipo de documento: ");
            String type = scanner.nextLine();

            System.out.print("Ingrese el formato (.pdf/.doc/.docx/.md/.csv/.txt/.xlsx): ");
            String format = scanner.nextLine();

            List<String> validFormats = Arrays.asList(".pdf", ".doc", ".docx", ".md", ".csv", ".txt", ".xlsx");
            if (!validFormats.contains(format.toLowerCase())) {
                System.out.println("❌ Formato no válido.");
                continue;
            }

            factory.processDocument(type, country, format);

            System.out.println("✅ Documento procesado en formato " + format + " con éxito.");
        }

        System.out.println("👋 Gracias por usar GlobalDocs.");
        scanner.close();
    }
}
