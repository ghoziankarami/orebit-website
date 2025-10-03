// File: custom.js
// Fungsi untuk memperbaiki ikon navbar di mobile

document.addEventListener("DOMContentLoaded", function() {
  const navbarToggler = document.querySelector('.navbar-toggler');

  if (navbarToggler) {
    // Buat elemen ikon Font Awesome
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-bars');
    
    // Hapus konten default (jika ada) dan sisipkan ikon baru
    navbarToggler.innerHTML = '';
    navbarToggler.appendChild(icon);

    // Fungsi untuk mengubah ikon saat di-klik
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === "aria-expanded") {
          const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
          if (isExpanded) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
          } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      });
    });

    // Amati perubahan pada atribut 'aria-expanded'
    observer.observe(navbarToggler, {
      attributes: true 
    });
  }
});