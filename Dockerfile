# Multi-stage build kullanarak daha küçük imaj oluşturma
FROM maven:3.8.6-openjdk-17-slim AS build

# Çalışma dizini
WORKDIR /app

# pom.xml ve source dosyalarını kopyala
COPY pom.xml .
COPY src ./src

# Projeyi derle
RUN mvn clean package -DskipTests

# Runtime imajı
FROM openjdk:17-jdk-slim

WORKDIR /app

# Build aşamasından JAR dosyasını kopyala
COPY --from=build /app/target/*.jar app.jar

# Port
EXPOSE 8080

# Uygulamayı çalıştır
ENTRYPOINT ["java", "-jar", "app.jar"]

