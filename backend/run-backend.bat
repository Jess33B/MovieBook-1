@echo off
echo Setting Java environment...
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=C:\Program Files\Java\jdk-17\bin;%PATH%"

echo Starting Spring Boot backend...
java -cp ".mvn\wrapper\maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=." org.apache.maven.wrapper.MavenWrapperMain spring-boot:run
