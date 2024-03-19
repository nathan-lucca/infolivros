// Evento disparado ao pressionar as teclas de atalho para abrir o Inspecionar e Código Fonte da Página
window.addEventListener(
  "keydown",
  function (event) {
    if (event.ctrlKey && event.keyCode === 85) {
      // Ctrl+U
      alert("Acesso ao código fonte não permitido!");
      event.preventDefault();
    } else if (event.keyCode === 123) {
      // 123 = Código da tecla F12
      alert("Acesso ao código fonte não permitido!");
      event.preventDefault();
    } else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
      // Ctrl+Shift+I
      alert("Acesso ao código fonte não permitido!");
      event.preventDefault();
    }
  },
  false
);

// Evento disparado ao clicar com o botão direito do mouse
window.addEventListener(
  "contextmenu",
  function (event) {
    event.preventDefault();
    alert("Acesso ao código fonte não permitido!");
  },
  false
);
