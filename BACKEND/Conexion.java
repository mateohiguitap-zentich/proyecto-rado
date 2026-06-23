import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexion {
    
    // Configuración de la conexión a la base de datos
    private static final String URL = "jdbc:mysql://localhost:3306/mydb";
    private static final String USUARIO = "root";
    private static final String CLAVE = "Ramon*17077*"; 
    // Método para establecer la conexión
    public static Connection conectar() {
        Connection conexion = null;
        try {
            // Intenta conectarse usando las credenciales
            conexion = DriverManager.getConnection(URL, USUARIO, CLAVE);
            System.out.println("✅ ¡Conexión exitosa a la base de datos MySQL!");
        } catch (SQLException e) {
            System.out.println("❌ Error al conectar a la base de datos.");
            System.out.println("Detalle del error: " + e.getMessage());
        }
        return conexion;
    }

    // Método principal para probar la conexión directamente al ejecutar este archivo
    public static void main(String[] args) {
        // Llamamos al método para ver si funciona
        conectar();
    }
}