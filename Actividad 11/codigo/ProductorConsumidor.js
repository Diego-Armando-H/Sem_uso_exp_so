class ProductorConsumidor {
  constructor() {
    this.pivot = 50;
    this.bufferSeccion = document.getElementById("buffer");
    this.buffer = [];
    for (let index = 0; index < 25; index++) {
      this.buffer.push("🍽");
      let node = document.createElement("li");
      node.id = `spaceBuffer_${index}`;
      node.classList.add(`card`);
      node.classList.add(`spaceBuffer`);
      node.innerText = `🍽`;
      //Generación de espacio en vista
      this.bufferSeccion.appendChild(node);
    }
    this.productor = new Productor(this.buffer);
    this.consumidor = new Consumidor(this.buffer);
  }

  /* Decidir si debe entrar el productor o el consumidor */
  decideAction() {
    this.productor.escribirConsecutivos();
    this.consumidor.escribirConsecutivos();
    let iniciarConsumidor = () => {
      this.productor.inRow = 0;
    };
    let iniciarProductor = () => {
      this.consumidor.inRow = 0;
    };
    if (this.productor.inRow > 4) {
      //Si supera las 5 seguidas devuelve al siguiente
      iniciarConsumidor();
      return this.consumidor;
    }
    if (this.consumidor.InRow > 4) {
      //Si supera las 5 seguidas devuelve al siguiente
      iniciarProductor();
      return this.productor;
    }
    //Validar primero la secuencia de seguidos de cada actor
    let rangeDecide = Math.random() * 100;
    //Dependiendo de la aleatoriedad decidimos cual devolver
    if (rangeDecide > this.pivot) {
      //Reescritura de seguidos
      iniciarConsumidor();
      return this.consumidor;
    }
    //Reescritura de seguidos
    iniciarProductor();
    return this.productor;
  }
}

class Productor {
  constructor(buffer) {
    this.buffer = buffer;
    this.indexProd = 0; //Se reinicia al llegar a 25
    this.producto = "🍝";
    this._inRow = 0;

    this.fieldState = document.getElementById("estadoProductor");

    this.prodEstSleep = document.getElementById("prodEstSleep"); //Representación de estado actual
    this.prodEstAccesing = document.getElementById("prodEstAccesing"); //Representación de estado actual
    this.prodEstProd = document.getElementById("prodEstProd"); //Representación de estado actual
    this.consecutivosProd = document.getElementById("consecutivosProd"); //Representación de estado actual
  }

  async producir() {
    removeAddClass(this.prodEstSleep, "elementoEstado", "elementoEstadoActivo");
    await this.cambiarTextoEstado("Accediendo a buffer");
    removeAddClass(this.prodEstSleep, "elementoEstadoActivo", "elementoEstado");
    removeAddClass(
      this.prodEstAccesing,
      "elementoEstado",
      "elementoEstadoActivo"
    );
    if (!this.buffer.includes("🍽")) {
      //no se puede producr
      await this.cambiarTextoEstado("Durmiendo sin espacio");
      removeAddClass(
        this.prodEstAccesing,
        "elementoEstadoActivo",
        "elementoEstado"
      );
      //Dormido
      removeAddClass(
        this.prodEstSleep,
        "elementoEstado",
        "elementoEstadoActivo"
      );
      return;
    }
    await this.cambiarTextoEstado("Produciendo");
    removeAddClass(
      this.prodEstAccesing,
      "elementoEstadoActivo",
      "elementoEstado"
    );
    //Producido
    this.buffer[this.indexProd] = this.producto;
    //Escritura en vista
    document.getElementById(`spaceBuffer_${this.indexProd}`).innerText =
      this.producto;

    this.indexProd = this.indexProd >= 24 ? 0 : this.indexProd + 1;
    removeAddClass(this.prodEstProd, "elementoEstado", "elementoEstadoActivo");
    this.addConcurrence();

    await this.cambiarTextoEstado("Durmiendo");
    removeAddClass(this.prodEstProd, "elementoEstadoActivo", "elementoEstado");
    //Dormido
    removeAddClass(this.prodEstSleep, "elementoEstado", "elementoEstadoActivo");
    //console.log(this.buffer);
  }
  escribirConsecutivos() {
    this.consecutivosProd.innerText = `Consecutivos: ${this.inRow}`;
  }

  async cambiarTextoEstado(texto) {
    await sleep(300); //dormimos la ejecución
    this.fieldState.innerText = `${texto}`;
  }
  get inRow() {
    return this._inRow;
  }
  set inRow(in_inRow) {
    this._inRow = in_inRow;
  }
  addConcurrence() {
    this._inRow++;
  }
}

class Consumidor {
  constructor(buffer) {
    this.buffer = buffer;
    this.indexCons = 0; //Se reinicia al llegar a 25
    this._inRow = 0;
    this.espacioLiberado = "🍽";
    this.fieldState = document.getElementById("estadoConsumidor");
    this.consEstSleep = document.getElementById("consEstSleep"); //Representación de estado actual
    this.consEstAccesing = document.getElementById("consEstAccesing"); //Representación de estado actual
    this.consEstCons = document.getElementById("consEstCons"); //Representación de estado actual
    this.consecutivosCons = document.getElementById("consecutivosCons"); //Representación de estado actual
  }

  async consumir() {
    //this.consecutivosProd.innerText = `Consecutivos: ${this.inRow}`;
    removeAddClass(this.consEstSleep, "elementoEstado", "elementoEstadoActivo");

    await this.cambiarTextoEstado("Accediendo a buffer");
    removeAddClass(this.consEstSleep, "elementoEstadoActivo", "elementoEstado");
    /* Accesando */
    removeAddClass(
      this.consEstAccesing,
      "elementoEstado",
      "elementoEstadoActivo"
    );
    if (!this.buffer.includes("🍝")) {
      await this.cambiarTextoEstado("Durmiendo sin producto");
      removeAddClass(
        this.consEstAccesing,
        "elementoEstadoActivo",
        "elementoEstado"
      );
      //no se puede consumir
      removeAddClass(
        this.consEstSleep,
        "elementoEstado",
        "elementoEstadoActivo"
      );
      return;
    }

    await this.cambiarTextoEstado("Consumiendo");
    removeAddClass(
      this.consEstAccesing,
      "elementoEstadoActivo",
      "elementoEstado"
    );
    //consumido
    this.buffer[this.indexCons] = this.espacioLiberado;
    document.getElementById(`spaceBuffer_${this.indexCons}`).innerText =
      this.espacioLiberado;
    removeAddClass(this.consEstCons, "elementoEstado", "elementoEstadoActivo");
    this.addConcurrence();
    this.escribirConsecutivos();
    await this.cambiarTextoEstado("Durmiendo");
    removeAddClass(this.consEstCons, "elementoEstadoActivo", "elementoEstado");
    //dormido
    removeAddClass(this.consEstSleep, "elementoEstado", "elementoEstadoActivo");
    this.indexCons = this.indexCons >= 24 ? 0 : this.indexCons + 1;
    //console.log(this.buffer);
  }
  escribirConsecutivos() {
    this.consecutivosCons.innerText = `Consecutivos: ${this.inRow}`;
  }

  async cambiarTextoEstado(texto) {
    await sleep(300); //dormimos la ejecución
    this.fieldState.innerText = `${texto}`;
  }
  get inRow() {
    return this._inRow;
  }
  set inRow(in_inRow) {
    this._inRow = in_inRow;
  }
  addConcurrence() {
    this._inRow++;
  }
}

function removeAddClass(domElement, remove, add) {
  domElement.classList.remove(remove);
  domElement.classList.add(add);
}

let prodCons;
let canceled = false;

async function initRuntime() {
  if (canceled) {
    return;
  }
  //await sleep(400); //dormimos la ejecución
  let actor = prodCons.decideAction();
  let steps = Math.random() * 1;
  //console.log(actor);
  if (actor instanceof Productor) {
    for (let index = 0; index < steps; index++) {
      await actor.producir();
    }
    window.requestAnimationFrame(initRuntime);
    return; //Finalización
  }
  for (let index = 0; index < steps; index++) {
    //es consumidor
    await actor.consumir();
  }
  //Repetimos el proceso
  window.requestAnimationFrame(initRuntime);
}

function reInitRuntime() {
  //Solo reiniciará si no esta cancelado
  if (!canceled) {
    alert("No se puede reiniciar si no se ha cancelado la ejecución");
    return;
  }
  canceled = false;
  initRuntime();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", (event) => {
  prodCons = new ProductorConsumidor();

  initRuntime();
  window.addEventListener("keydown", (event) => {
    console.log(event.key);
    switch (event.key) {
      case "Escape": {
        canceled = true;
        break;
      }
    }
  });
});
