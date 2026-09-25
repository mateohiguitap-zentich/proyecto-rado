# ETAPA 1: Construcción (Render compilará el proyecto por ti)
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copiamos los archivos necesarios para Maven y el código fuente
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Damos permisos al ejecutable de Maven y compilamos el proyecto
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# ETAPA 2: Ejecución (Se arma la caja final)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Traemos ÚNICAMENTE el .jar que se generó en la Etapa 1
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]