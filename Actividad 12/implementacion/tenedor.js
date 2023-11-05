class Tenedor {
  constructor() {
    this._semaforo = 1;
  }

  usar() {
    if (this._semaforo > 0) {
      this._semaforo--;
      return true;
    }
    this._semaforo--;
    return false; //Se debe bloquear externamente al recurso que quiere usar
  }

  liberar() {
    this._semaforo++;
  }

  get semaforo() {
    return this._semaforo;
  }
  set semaforo(in_semaforo) {
    this._semaforo = in_semaforo;
  }

  get disponible() {
    return this._semaforo > 0;
  }

  escribirSemaforo(index) {
    document.getElementById(
      `tenedor${index}`
    ).innerText = `🍴${index}-${this._semaforo}`;
  }
}
