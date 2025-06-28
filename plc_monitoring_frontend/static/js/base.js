const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

function isMobileView() {
  return window.innerWidth <= 800;
}

function toggleSidebar() {
  if (isMobileView()) {
    sidebar.classList.toggle('open'); // ✅ solo usamos "open" en móvil
  } else {
    sidebar.classList.toggle('close'); // ✅ solo usamos "close" en escritorio
    toggleButton.classList.toggle('rotate');
  } 

  closeAllSubMenus();
}

function toggleSubMenu(button) {
  if (!button.nextElementSibling.classList.contains('show')) {
    closeAllSubMenus();
  }

  button.nextElementSibling.classList.toggle('show');
  button.classList.toggle('rotate');

  // Si está cerrado en escritorio, ábrelo
  if (!isMobileView() && sidebar.classList.contains('close')) {
    sidebar.classList.remove('close');
    toggleButton.classList.remove('rotate');
  }
}

function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show');
    ul.previousElementSibling.classList.remove('rotate');
  });
}

// ✅ Cierra el sidebar en móvil si haces clic fuera
document.addEventListener("click", function (e) {
  if (isMobileView() && !sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
    sidebar.classList.remove("open");
  }
});
