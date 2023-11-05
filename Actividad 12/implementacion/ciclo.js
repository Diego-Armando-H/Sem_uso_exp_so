function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function iniciarCiclo() {
  ciclo();
}

function ciclo() {
  sleep(1000);
  //validar que todos hayan comido
  if (gestorComensales.todosComieron()) {
    console.log("terminado");
    return;
  }
  //continuar ciclo de ejecución
  gestorComensales.despertar();
  //window.requestAnimationFrame(iniciarCiclo);
}

let gestorComensales = null;
document.addEventListener("DOMContentLoaded", (event) => {
  gestorComensales = new GestorComensales();
  ciclo();
});
