import java.io.*;
import java.util.*;

public class runner {
    public static void main(String[] args) {
        try {
            // Set environment variables
            System.setProperty("JAVA_HOME", "C:\\Program Files\\Java\\jdk-17");
            
            // Build Maven command
            List<String> command = new ArrayList<>();
            command.add("cmd");
            command.add("/c");
            command.add("set JAVA_HOME=C:\\Program Files\\Java\\jdk-17 && set PATH=%JAVA_HOME%\\bin;%PATH% && mvn spring-boot:run");
            
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.directory(new File("."));
            pb.inheritIO();
            
            Process process = pb.start();
            process.waitFor();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
