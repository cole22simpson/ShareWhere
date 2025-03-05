FROM openjdk:17-alpine
LABEL maintainer="Cole Simpson <cole22simpson@gmail.com>"
WORKDIR /app
EXPOSE 8080
COPY target/ShareWhere-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
