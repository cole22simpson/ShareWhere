FROM maven:3.8.3-openjdk-17 AS build
COPY pom.xml ./
COPY src ./src
RUN mvn clean install -Pdocker-build

FROM openjdk:17-jdk-alpine
COPY --from=build target/ShareWhere-0.0.1-SNAPSHOT.jar ./ShareWhere-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/ShareWhere-0.0.1-SNAPSHOT.jar"]
