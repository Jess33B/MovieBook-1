@echo off
echo Setting up Java environment...
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

echo Starting Spring Boot application...
java -cp "target\classes;target\dependency\*" com.moviebooking.MovieBookingApplication
