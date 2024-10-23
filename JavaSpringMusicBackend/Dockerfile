# Sử dụng base image cho Java
FROM openjdk:17-jdk-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép tệp JAR của ứng dụng vào container
COPY target/JavaSpringMusicBackend-0.0.1-SNAPSHOT.jar app.jar

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 8081

# Chạy ứng dụng Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
