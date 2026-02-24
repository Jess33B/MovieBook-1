@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=C:\Program Files\Java\jdk-17\bin;%PATH%
echo Starting backend...
mvn spring-boot:run
pause
