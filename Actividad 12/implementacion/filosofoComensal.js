class FilosofoComensal {
  static estados = {
    1: "durmiendo",
    2: "pensando", //Hambriento
    3: "comiendo",
  };
  static imgs = {
    1: "durmiedo.png",
    2: "pensando.png", //Hambriento
    3: "comiendo.png",
  };
  constructor() {
    this.estadoActual = 1;
    this._vecesAlimentado = 0;
    this._izq; //indices en los que tomará al tenedor
    this._der; //indices en los que tomará al tenedor
    this._progresoEstado = 1; //Al contar a 3 se debe cambiar al estado siguiente
  }
  get izq() {
    return this._izq;
  }
  set izq(in_izq) {
    this._izq = in_izq;
  }

  get der() {
    return this._der;
  }
  set der(in_der) {
    this._der = in_der;
  }

  dormir() {
    this.estadoActual = 1;
  }
  hambriento() {
    this.estadoActual = 2;
  }
  comer() {
    this.estadoActual = 3;
  }
  get progresoEstado() {
    return this._progresoEstado;
  }
  set progresoEstado(in_progresoEstado) {
    this._progresoEstado = in_progresoEstado;
  }
  get imgActual() {
    return FilosofoComensal.imgs[this.estadoActual];
  }

  //Debe ser utilizado al final de la ejecución de las acciones necesarioas
  progresarEstado() {
    if (this._progresoEstado % 3 == 0) {
      //Cambiar de estado
      this.estadoActual = this.estadoActual >= 3 ? 1 : this.estadoActual + 1;
      this._progresoEstado = 1; //Reiiciamos progreso
      return;
    }
    //Avanzar progreso estado
    this._progresoEstado++;
  }

  get vecesAlimentado() {
    return this._vecesAlimentado;
  }
  set vecesAlimentado(in_vecesAlimentado) {
    this._vecesAlimentado = in_vecesAlimentado;
  }
  //en desuso: Inicia el ciclo de vida del filosofo comensal
  despertar() {
    setInterval(() => {
      if (this.estadoActual == 1) {
        //está dormido, no hacer nada
        return;
      }
      if (this.estadoActual == 2) {
        //intenta acceder a los cubiertos
        return;
      }
      //Ya debe estar comiendo en este punto
    }, 100);
  }
}

class GestorComensales {
  constructor() {
    this.comensales = [];
    this.tenedores = [];
    for (let index = 0; index < 5; index++) {
      let filosofo = new FilosofoComensal();
      filosofo.izq = index;
      filosofo.der = (index + 1) % 5;
      this.comensales.push(filosofo);
      let tenedor = new Tenedor();
      this.tenedores.push(tenedor);
    }
  }

  todosComieron() {
    let todosComieron = true;
    /* console.log(this.comensales); */
    this.comensales.map((comensal) => {
      /* console.log(comensal.vecesAlimentado); */
      if (!todosComieron) {
        //Por lo menos uno no comío, ya no revisamos los demas
        return;
      }
      //Seguirá siendo "true" si ha comido 6 veces
      todosComieron = comensal.vecesAlimentado >= 6;
    });
    /* console.log(todosComieron); */
    return todosComieron;
  }

  despertar() {
    //lanzar función para separar ejecución de todos los filosofos
    this.comensales.map((comensal, index, a) => {
      sleep(10);
      //Se debe ejecutar de manera asincrona
      setInterval(() => {
        document.getElementById(`estadoFilosofo${index}`).src =
          comensal.imgActual;
        document.getElementById(
          `filosofo${index}`
        ).innerText = `f${index}t i${comensal.izq} d${comensal.der} c${comensal.vecesAlimentado}`;
        if (this.todosComieron()) {
          return;
        }
        //console.log(comensal.estadoActual);
        this.tenedores[comensal.izq].escribirSemaforo(comensal.izq);
        this.tenedores[comensal.der].escribirSemaforo(comensal.der);

        if (comensal.estadoActual == 1) {
          //está dormido, no hacer nada
          comensal.progresarEstado();
          return;
        }
        if (comensal.estadoActual == 2) {
          //intenta acceder a los cubiertos
          //Si alguno de los tenedores no esta disponible, no avanzamos
          console.log(
            `comensal ${index}`,
            !this.tenedores[comensal.izq].disponible,
            !this.tenedores[comensal.der].disponible
          );
          if (
            !this.tenedores[comensal.izq].disponible ||
            !this.tenedores[comensal.der].disponible
          ) {
            sleep(1000); //Detenemos la ejecución para no forzar demasiado el flujo

            return;
          }
          //Siguen sin ser disponibles

          //Ya están disponibles ambos, se pueden tomar
          this.tenedores[comensal.izq].usar();
          this.tenedores[comensal.der].usar();

          comensal.comer();
          return;
        }
        //En este punto ya esta comiendo
        if (comensal.progresoEstado % 3 == 0) {
          //Si está apunto de terminar entonces se debe liberar el recurso
          this.tenedores[comensal.izq].liberar();
          this.tenedores[comensal.der].liberar();
          comensal.vecesAlimentado++;
        }
        comensal.progresarEstado();
      }, 500);
    });
  }
}
