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
    /* this.states = {
      dormido: true,
      produciendo: false,
      intentando: false,
      actualizarDormido: function (b) {
        this.dormido = b;
        //sleep(100);
      },
      actualizarProducir: function (b) {
        this.produciendo = b;
        //sleep(100);
      },
      actualizarIntentando: function (b) {
        this.intentando = b;
        //sleep(100);
      },
    }; */
  }

  async producir() {
    await this.cambiarTextoEstado("Accediendo a buffer");
    if (!this.buffer.includes("🍽")) {
      //no se puede producr
      await this.cambiarTextoEstado("Durmiendo sin espacio");
      return;
    }
    await this.cambiarTextoEstado("Produciendo");
    //Producido
    this.buffer[this.indexProd] = this.producto;
    //Escritura en vista
    document.getElementById(`spaceBuffer_${this.indexProd}`).innerText =
      this.producto;
    this.indexProd = this.indexProd >= 24 ? 0 : this.indexProd + 1;
    await this.cambiarTextoEstado("Durmiendo");
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
  }

  async consumir() {
    await this.cambiarTextoEstado("Accediendo a buffer");
    if (!this.buffer.includes("🍝")) {
      await this.cambiarTextoEstado("Durmiendo sin producto");
      //no se puede consumir
      return;
    }
    await this.cambiarTextoEstado("Consumiendo");
    //consumido
    this.buffer[this.indexCons] = this.espacioLiberado;
    document.getElementById(`spaceBuffer_${this.indexCons}`).innerText =
      this.espacioLiberado;
    await this.cambiarTextoEstado("Durmiendo");
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
