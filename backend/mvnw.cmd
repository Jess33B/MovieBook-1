@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script, adapted from Maven's wrapper script for Windows
@REM ----------------------------------------------------------------------------

@setlocal

set ERROR_CODE=0

@REM To isolate internal variables from possible post scripts, we use another setlocal
setlocal

@REM ==== START VALIDATION ====
if not defined JAVA_HOME (
  echo.
  echo ERROR: JAVA_HOME not found in your environment.
  echo.
  echo Please set the JAVA_HOME variable in your environment to match the
  echo location of your Java installation.
  echo.
  goto error
)

if not exist "%JAVA_HOME%\bin\java.exe" (
  echo.
  echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
  echo.
  echo Please set the JAVA_HOME variable in your environment to match the
  echo location of your Java installation.
  echo.
  goto error
)

@REM ==== START EXECUTION ====

@REM Find the project base directory, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current working directory if not found.

set MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
if NOT "%MAVEN_PROJECTBASEDIR%"=="" (
  set EXEC_DIR=%cd%
  set MAVEN_PROJECTBASEDIR=%EXEC_DIR%
)

if exist "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar" (
  set MAVEN_WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
) else (
  echo.
  echo ERROR: MAVEN_WRAPPER_JAR not found
  echo.
  goto error
)

@REM ==== START MAVEN WRAPPER ====

@REM Execute Maven using the wrapper
"%JAVA_HOME%\bin\java" ^
  %MAVEN_OPTS% ^
  %MAVEN_DEBUG_OPTS% ^
  -classpath "%MAVEN_WRAPPER_JAR%" ^
  "-Dmaven.home=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper" ^
  org.apache.maven.wrapper.MavenWrapperMain ^
  %MAVEN_CMD_LINE_ARGS%

if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%

exit /B %ERROR_CODE%
