import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UsuarioDAO {

    // 1. Método para INSERTAR (Create)
    public void insertarUsuario(String nombre, String contrasena, String rol) {
        String sql = "INSERT INTO USUARIO (nombre_usuario, contrasena_usuario, rol_usuario) VALUES (?, ?, ?)";
        try (Connection conn = Conexion.conectar();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            // Reemplazamos los signos de interrogación por los datos reales
            pstmt.setString(1, nombre);
            pstmt.setString(2, contrasena);
            pstmt.setString(3, rol);
            
            int filasAfectadas = pstmt.executeUpdate();
            if (filasAfectadas > 0) {
                System.out.println("✅ Usuario insertado correctamente en la BD.");
            }
        } catch (SQLException e) {
            System.out.println("❌ Error al insertar usuario: " + e.getMessage());
        }
    }

    // 2. Método para CONSULTAR (Read)
    public void consultarUsuarios() {
        String sql = "SELECT * FROM USUARIO";
        try (Connection conn = Conexion.conectar();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
            System.out.println("\n--- Lista de Usuarios Registrados ---");
            while (rs.next()) { // Recorremos fila por fila los resultados
                int id = rs.getInt("id_usuario");
                String nombre = rs.getString("nombre_usuario");
                String rol = rs.getString("rol_usuario");
                
                System.out.println("ID: " + id + " | Nombre: " + nombre + " | Rol: " + rol);
            }
            System.out.println("-------------------------------------\n");
            
        } catch (SQLException e) {
            System.out.println("❌ Error al consultar usuarios: " + e.getMessage());
        }
    }

    // 3. Método para ACTUALIZAR (Update)
    public void actualizarUsuario(int id, String nuevoNombre, String nuevaContrasena, String nuevoRol) {
        String sql = "UPDATE USUARIO SET nombre_usuario = ?, contrasena_usuario = ?, rol_usuario = ? WHERE id_usuario = ?";
        try (Connection conn = Conexion.conectar();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, nuevoNombre);
            pstmt.setString(2, nuevaContrasena);
            pstmt.setString(3, nuevoRol);
            pstmt.setInt(4, id); // El ID va al final porque es el último signo de interrogación
            
            int filasAfectadas = pstmt.executeUpdate();
            if (filasAfectadas > 0) {
                System.out.println("✅ Usuario con ID " + id + " actualizado correctamente.");
            } else {
                System.out.println("⚠️ No se encontró ningún usuario con el ID " + id);
            }
        } catch (SQLException e) {
            System.out.println("❌ Error al actualizar usuario: " + e.getMessage());
        }
    }

    // 4. Método para ELIMINAR (Delete)
    public void eliminarUsuario(int id) {
        String sql = "DELETE FROM USUARIO WHERE id_usuario = ?";
        try (Connection conn = Conexion.conectar();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            
            int filasAfectadas = pstmt.executeUpdate();
            if (filasAfectadas > 0) {
                System.out.println("✅ Usuario con ID " + id + " eliminado de la BD.");
            } else {
                System.out.println("⚠️ No se encontró ningún usuario con el ID " + id);
            }
        } catch (SQLException e) {
            System.out.println("❌ Error al eliminar usuario: " + e.getMessage());
        }
    }

    // =========================================================
    // MÉTODO PRINCIPAL PARA PROBAR TODAS LAS FUNCIONALIDADES
    // =========================================================
    public static void main(String[] args) {
        UsuarioDAO dao = new UsuarioDAO();

               
        System.out.println("Iniciando pruebas del módulo de Usuarios...");

        // 1. Insertar
        dao.insertarUsuario("Carlos Ramirez", "clave123", "Administrador");
        //dao.insertarUsuario("Laura Gomez", "segura456", "Recepcionista");

        // 2. Probar Consultar (Te mostrará todos los que has insertado)
        //dao.consultarUsuarios();

        // 3. Actualizar
        //dao.actualizarUsuario(1, "Carlos Ramirez (Modificado)", "nuevaclave", "Gerente");

        // 4. Eliminar
        //dao.eliminarUsuario(1);
    }
}
