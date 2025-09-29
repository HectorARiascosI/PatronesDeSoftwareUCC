package com.globaldocs.documents;

public abstract class AbstractDocument implements Document {
    protected String name;
    protected String format;

    public AbstractDocument(String name, String format) {
        this.name = name;
        this.format = format;
    }

    public String getName() {
        return name;
    }

    public String getFormat() {
        return format;
    }

    public void logProcess() {
        System.out.println("📝 Registro: Procesando documento " + name + " en formato " + format);
    }

    @Override
    public abstract void process();

    @Override
    public abstract void validate(String country);

    @Override
    public abstract void handleError();
}
