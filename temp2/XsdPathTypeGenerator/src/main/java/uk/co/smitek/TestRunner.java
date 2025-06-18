package uk.co.smitek;

import java.io.InputStream;
import java.util.Map;

public class TestRunner {
    public static void main(String[] args) {
        String xsdPath = "/simple.xsd"; // IMPORTANT: no "./" here for classpath resource
        String rootElement = "employee";

        // Debug print statements
        System.out.println("Trying to load: " + xsdPath);
        InputStream test = TestRunner.class.getClassLoader().getResourceAsStream(xsdPath);
        System.out.println("Found? " + (test != null));

        //if (test == null) {
        //    System.err.println("ERROR: File not found on classpath! Exiting...");
        //    return;
        //}

        // Proceed with generator if file found
        XsdPathTypeGenerator generator = new XsdPathTypeGenerator();
        Map<String, String> pathTypes = generator.generateMap(rootElement, xsdPath);

        pathTypes.forEach((path, type) -> System.out.println(path + " -> " + type));
    }
}
