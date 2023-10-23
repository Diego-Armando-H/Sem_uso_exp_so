- [x] 1. Existen un solo un productor y un solo consumidor.

- [x] 2. Se cuenta con un “contenedor” con capacidad para 25 elementos, en el cual el productor colocará y el consumidor retirará elementos.

- [x] 3. El “contenedor”, lógicamente es un buffer circular y acotado, es decir al llegar a la última casilla (25) comenzará nuevamente en la casilla 1 (los espacios deben estar perfectamente señalados).

- [x] 4. El producto puede ser: números, caracteres especiales, letras, hamburguesas, galletas, etc.

- [x] 5. Solo puede ingresar uno a la vez al contenedor.

- [x] 6. Para que el Productor pueda entrar, debe haber espacio en el contenedor y no estar el Consumidor dentro.

- [x] 7. Para que el Consumidor pueda entrar, debe existir producto y no estar el productor dentro.

- [x] 8. En la pantalla debe aparecer:

i.    La información del productor, es decir, mostrar si está dormido, trabajando, cuando intente ingresar al contenedor, etc.

ii.    La información del consumidor, dormido, trabajando, cuando intente ingresar, etc.

iii.    Mensajes que indiquen en todo momento, quien está trabajando, o quien intenta trabajar, o si está dormido.

- [x] 9.  Deben manejarse tiempos aleatorios para dormir al productor y al consumidor. (Omitido al no implementarse el semáforo)

- [x] 10.  Al “despertar” intentará producir y/o consumir respectivamente, verificando que pueda hacerlo según sus condiciones.

- [ ] 11.  Al entrar al buffer podrán producir y/o consumir de forma finita (de 1 a 5 elementos).

- [x] 12.  El productor colocará elementos en orden, comenzando con la primera casilla, y continuando desde la última posición donde se quedó.

- [x] 13.  El consumidor quitará elementos en orden, comenzando también por la primera casilla y continuando en la última donde quedo.

- [x] 14.  El programa terminara al presionar la tecla escape.