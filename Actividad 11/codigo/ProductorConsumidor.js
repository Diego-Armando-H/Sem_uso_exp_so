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
    let rangeDecide = Math.random() * 100;
    //Dependiendo de la aleatoriedad decidimos cual devolver
    return rangeDecide > this.pivot ? this.consumidor : this.productor;
  }
}

class Productor {
  constructor(buffer) {
    this.buffer = buffer;
    this.indexProd = 0; //Se reinicia al llegar a 25
    this.producto = "🍝";
    this.fieldState = document.getElementById("estadoProductor");

    this.prodEstSleep = document.getElementById("prodEstSleep"); //Representación de estado actual
    this.prodEstAccesing = document.getElementById("prodEstAccesing"); //Representación de estado actual
    this.prodEstProd = document.getElementById("prodEstProd"); //Representación de estado actual
  }

  async producir() {
    this.prodEstSleep.classList.remove("elementoEstado");
    this.prodEstSleep.classList.add("elementoEstadoActivo");
    await this.cambiarTextoEstado("Accediendo a buffer");
    this.prodEstSleep.classList.add("elementoEstado");
    this.prodEstSleep.classList.remove("elementoEstadoActivo");
    this.prodEstAccesing.classList.remove("elementoEstado");
    this.prodEstAccesing.classList.add("elementoEstadoActivo");
    if (!this.buffer.includes("🍽")) {
      //no se puede producr
      await this.cambiarTextoEstado("Durmiendo sin espacio");
      this.prodEstAccesing.classList.remove("elementoEstado");
      this.prodEstAccesing.classList.add("elementoEstadoActivo");
      //Dormido
      this.prodEstSleep.classList.remove("elementoEstado");
      this.prodEstSleep.classList.add("elementoEstadoActivo");
      return;
    }

    await this.cambiarTextoEstado("Produciendo");
    this.prodEstAccesing.classList.add("elementoEstado");
    this.prodEstAccesing.classList.remove("elementoEstadoActivo");
    //Producido
    this.buffer[this.indexProd] = this.producto;
    //Escritura en vista
    document.getElementById(`spaceBuffer_${this.indexProd}`).innerText =
      this.producto;
    this.indexProd = this.indexProd >= 24 ? 0 : this.indexProd + 1;
    this.prodEstProd.classList.remove("elementoEstado");
    this.prodEstProd.classList.add("elementoEstadoActivo");
    await this.cambiarTextoEstado("Durmiendo");
    this.prodEstProd.classList.add("elementoEstado");
    this.prodEstProd.classList.remove("elementoEstadoActivo");
    //Dormido
    this.prodEstSleep.classList.remove("elementoEstado");
    this.prodEstSleep.classList.add("elementoEstadoActivo");
    //console.log(this.buffer);
  }

  async cambiarTextoEstado(texto) {
    await sleep(300); //dormimos la ejecución
    this.fieldState.innerText = `${texto}`;
  }
}

class Consumidor {
  constructor(buffer) {
    this.buffer = buffer;
    this.indexCons = 0; //Se reinicia al llegar a 25
    this.espacioLiberado = "🍽";
    this.fieldState = document.getElementById("estadoConsumidor");
    this.consEstSleep = document.getElementById("consEstSleep"); //Representación de estado actual
    this.consEstAccesing = document.getElementById("consEstAccesing"); //Representación de estado actual
    this.consEstCons = document.getElementById("consEstCons"); //Representación de estado actual
  }

  async consumir() {
    this.consEstSleep.classList.remove("elementoEstado");
    this.consEstSleep.classList.add("elementoEstadoActivo");
    await this.cambiarTextoEstado("Accediendo a buffer");
    this.consEstSleep.classList.add("elementoEstado");
    this.consEstSleep.classList.remove("elementoEstadoActivo");
    /* Accesando */
    this.consEstAccesing.classList.remove("elementoEstado");
    this.consEstAccesing.classList.add("elementoEstadoActivo");
    if (!this.buffer.includes("🍝")) {
      await this.cambiarTextoEstado("Durmiendo sin producto");
      this.consEstAccesing.classList.add("elementoEstado");
      this.consEstAccesing.classList.remove("elementoEstadoActivo");
      //no se puede consumir
      this.consEstSleep.classList.remove("elementoEstado");
      this.consEstSleep.classList.add("elementoEstadoActivo");
      return;
    }

    await this.cambiarTextoEstado("Consumiendo");
    this.consEstAccesing.classList.add("elementoEstado");
    this.consEstAccesing.classList.remove("elementoEstadoActivo");
    //consumido
    this.buffer[this.indexCons] = this.espacioLiberado;
    document.getElementById(`spaceBuffer_${this.indexCons}`).innerText =
      this.espacioLiberado;
    this.consEstCons.classList.remove("elementoEstado");
    this.consEstCons.classList.add("elementoEstadoActivo");
    await this.cambiarTextoEstado("Durmiendo");
    this.consEstCons.classList.add("elementoEstado");
    this.consEstCons.classList.remove("elementoEstadoActivo");
    //dormido
    this.consEstSleep.classList.remove("elementoEstado");
    this.consEstSleep.classList.add("elementoEstadoActivo");
    this.indexCons = this.indexCons >= 24 ? 0 : this.indexCons + 1;
    //console.log(this.buffer);
  }

  async cambiarTextoEstado(texto) {
    await sleep(300); //dormimos la ejecución
    this.fieldState.innerText = `${texto}`;
  }
}

let prodCons;

async function initRuntime() {
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", (event) => {
  prodCons = new ProductorConsumidor();

  initRuntime();
});
