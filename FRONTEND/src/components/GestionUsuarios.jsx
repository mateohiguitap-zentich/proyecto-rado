import React, { useState } from 'react';

// Subcomponente reutilizable para los campos de contraseña
const PasswordInput = ({ placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-group shadow-sm">
      <span className="input-group-text bg-light">
        <i className="bi bi-lock text-muted"></i>
      </span>
      <input
        type={showPassword ? 'text' : 'password'}
        className="form-control bg-light"
        placeholder={placeholder}
      />
      <span
        className="input-group-text bg-light"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowPassword(!showPassword)}
      >
        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
      </span>
    </div>
  );
};

// Componente Principal
const GestionUsuarios = () => {
  // Estados para la seguridad inicial
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [authError, setAuthError] = useState(false);

  // Estado para el control de pestañas
  const [activeTab, setActiveTab] = useState('registrar');

  // Estados para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteKey, setDeleteKey] = useState('');
  const [deleteError, setDeleteError] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState('');

  // Función para verificar acceso inicial
  const handleVerifyAccess = () => {
    if (adminKey === 'admin123') {
      setIsAuthorized(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Función para confirmar eliminación
  const handleConfirmDelete = () => {
    if (deleteKey === 'admin123') {
      setShowDeleteModal(false);
      setShowDeleteSuccess(true);
      setDocumentToDelete('');
      setDeleteKey('');
      
      // Ocultar alerta de éxito después de 4 segundos
      setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 4000);
    } else {
      setDeleteError(true);
    }
  };

  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      {/* MODAL DE SEGURIDAD (Se renderiza condicionalmente si no está autorizado) */}
      {!isAuthorized && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="modal-header bg-primary text-white" style={{ borderRadius: '20px 20px 0 0' }}>
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-shield-lock-fill me-2"></i> Acceso Restringido
                </h5>
              </div>
              <div className="modal-body p-4 text-center">
                <p className="text-muted mb-4">
                  Esta sección requiere privilegios de Administrador. Por favor, ingrese su clave maestra para continuar.
                </p>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-key text-primary"></i>
                  </span>
                  <input
                    type="password"
                    className={`form-control ${authError ? 'is-invalid' : ''}`}
                    placeholder="Clave de Administrador (ej: admin123)"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyAccess()}
                  />
                </div>
                {authError && (
                  <div className="text-danger small fw-bold mb-3">Clave incorrecta. Intente de nuevo.</div>
                )}
                <button className="btn btn-primary w-100 fw-bold py-2" onClick={handleVerifyAccess}>
                  Verificar Acceso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ELIMINACIÓN */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="modal-header bg-danger text-white" style={{ borderRadius: '20px 20px 0 0' }}>
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> Confirmar Eliminación
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <p className="text-muted mb-4">
                  Está a punto de eliminar un usuario del sistema RADO. Esta acción no se puede deshacer. <strong>Ingrese su clave de administrador para confirmar.</strong>
                </p>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-key text-danger"></i>
                  </span>
                  <input
                    type="password"
                    className={`form-control ${deleteError ? 'is-invalid' : ''}`}
                    placeholder="Clave de Administrador"
                    value={deleteKey}
                    onChange={(e) => setDeleteKey(e.target.value)}
                  />
                </div>
                {deleteError && (
                  <div className="text-danger small fw-bold mb-3">Clave incorrecta. Intente de nuevo.</div>
                )}
                <button className="btn btn-danger w-100 fw-bold py-2" onClick={handleConfirmDelete}>
                  <i className="bi bi-trash3 me-2"></i> Eliminar Definitivamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL (Con efecto blur si no está autorizado) */}
      <div 
        className="main-wrapper d-flex" 
        style={{ 
          filter: isAuthorized ? 'none' : 'blur(5px)',
          pointerEvents: isAuthorized ? 'auto' : 'none',
          transition: 'filter 0.3s ease'
        }}
      >
        {/* Aquí iría tu Sidebar, lo omito por brevedad pero puedes pegarlo igual cambiando class a className */}
        
        <main className="content-area w-100 p-4">
          <header className="mb-4">
            <h2 className="fw-bold h4 text-dark">Gestión de Usuarios</h2>
          </header>

          {/* PESTAÑAS (Tabs) */}
          <ul className="nav nav-tabs custom-tabs mb-0" role="tablist">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'registrar' ? 'active' : ''}`} 
                style={{ color: activeTab === 'registrar' ? '#2D89EF' : '#475569', fontWeight: 'bold', background: 'transparent', border: 'none' }}
                onClick={() => setActiveTab('registrar')}
              >
                Registrar Usuario
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'editar' ? 'active' : ''}`} 
                style={{ color: activeTab === 'editar' ? '#2D89EF' : '#475569', fontWeight: 'bold', background: 'transparent', border: 'none' }}
                onClick={() => setActiveTab('editar')}
              >
                Editar Usuario
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'eliminar' ? 'active' : ''}`} 
                style={{ color: activeTab === 'eliminar' ? '#dc3545' : '#475569', fontWeight: 'bold', background: 'transparent', border: 'none' }}
                onClick={() => setActiveTab('eliminar')}
              >
                Eliminar Usuario
              </button>
            </li>
          </ul>

          <div className="tab-content bg-white p-4 p-md-5 rounded-bottom shadow-sm border border-top-0" style={{ maxWidth: '800px' }}>
            
            {/* VISTA REGISTRAR */}
            {activeTab === 'registrar' && (
              <form className="row g-4">
                <div className="col-12">
                  <label className="form-label small text-muted fw-bold">Número de documento</label>
                  <div className="input-group shadow-sm">
                    <span className="input-group-text bg-light"><i className="bi bi-file-earmark-text text-muted"></i></span>
                    <input type="text" className="form-control bg-light" placeholder="Ingrese el número de documento" />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label small text-muted fw-bold">Nueva clave</label>
                  <PasswordInput placeholder="Ingrese la nueva clave" />
                </div>
                <div className="col-12">
                  <label className="form-label small text-muted fw-bold">Confirmar clave</label>
                  <PasswordInput placeholder="Confirme la clave" />
                </div>
                <div className="col-12">
                  <label className="form-label small text-muted fw-bold">Asignar rol</label>
                  <div className="input-group shadow-sm">
                    <span className="input-group-text bg-light"><i className="bi bi-person text-muted"></i></span>
                    <select className="form-select bg-light text-muted" defaultValue="">
                      <option value="" disabled>Seleccione un rol</option>
                      <option value="admin">Administrador</option>
                      <option value="odontologo">Técnico RX</option>
                      <option value="recepcion">Recepcionista / Cajero</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-between mt-5">
                  <button type="button" className="btn btn-primary w-50 me-2 py-2 fw-bold shadow-sm">Guardar</button>
                  <button type="button" className="btn btn-secondary w-50 ms-2 py-2 fw-bold shadow-sm">Salir</button>
                </div>
              </form>
            )}

            {/* VISTA EDITAR */}
            {activeTab === 'editar' && (
              <form className="row g-4">
                 {/* ... (Contenido similar convertido a className y PasswordInput) ... */}
                 <div className="col-12">
                    <h5 className="text-muted">Sección de edición (Estructura similar a Registro)</h5>
                 </div>
              </form>
            )}

            {/* VISTA ELIMINAR */}
            {activeTab === 'eliminar' && (
              <form className="row g-4">
                <div className="col-12">
                  {showDeleteSuccess && (
                    <div className="alert alert-success" role="alert">
                      <i className="bi bi-check-circle-fill me-2"></i> ¡Usuario eliminado con éxito del sistema RADO!
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label small text-danger fw-bold"><i className="bi bi-search me-1"></i> Buscar Usuario a Eliminar</label>
                  <div className="input-group shadow-sm border border-danger rounded">
                    <span className="input-group-text bg-white border-0"><i className="bi bi-search text-danger"></i></span>
                    <input 
                      type="text" 
                      className="form-control border-0" 
                      placeholder="Ingrese el documento a buscar..."
                      value={documentToDelete}
                      onChange={(e) => setDocumentToDelete(e.target.value)}
                    />
                    <button className="btn btn-outline-danger px-4 fw-bold border-0 border-start" type="button">Buscar</button>
                  </div>
                </div>
                
                <div className="col-12 text-center mt-5">
                  <button 
                    type="button" 
                    className="btn btn-danger w-75 py-3 fw-bold shadow-sm fs-5" 
                    onClick={() => {
                        setDeleteError(false);
                        setShowDeleteModal(true);
                    }}
                  >
                    <i className="bi bi-trash3 me-2"></i> Eliminar Usuario
                  </button>
                </div>
              </form>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default GestionUsuarios;