import Swal from 'sweetalert2';

/**
 * Utilidad centralizada para SweetAlert2
 * Adaptada para Dark Mode y estilos del proyecto
 */

const isDarkMode = () => document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');

const getCustomConfig = () => ({
  background: isDarkMode() ? '#1a222c' : '#ffffff',
  color: isDarkMode() ? '#ffffff' : '#1a222c',
  confirmButtonColor: '#3c50e0', // primary color
  cancelButtonColor: '#d33',
  didOpen: (toast: HTMLElement) => {
    // Aseguramos que el contenedor de Swal esté por encima del navbar (z-99999)
    const container = Swal.getContainer();
    if (container) {
      container.style.zIndex = '999999';
    }
  }
});

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    ...getCustomConfig(),
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    ...getCustomConfig(),
    icon: 'error',
    title,
    text: text || 'Ocurrió un error inesperado',
    confirmButtonText: 'Entendido',
  });
};

export const showInfo = (title: string, text?: string) => {
  return Swal.fire({
    ...getCustomConfig(),
    icon: 'info',
    title,
    text,
    timer: 3000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  });
};

/**
 * Alerta informativa persistente (útil para notificar cambios realizados)
 */
export const showNotify = (title: string, text?: string) => {
    return Swal.fire({
      ...getCustomConfig(),
      icon: 'info',
      title,
      text,
      confirmButtonText: 'Cerrar',
    });
  };

export const showConfirm = async (title: string, text: string) => {
  const result = await Swal.fire({
    ...getCustomConfig(),
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  });

  return result.isConfirmed;
};

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  notify: showNotify,
  confirm: showConfirm,
};
