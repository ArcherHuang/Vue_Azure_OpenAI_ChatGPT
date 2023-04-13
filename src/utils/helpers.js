import Swal from 'sweetalert2';

// eslint-disable-next-line
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
});
