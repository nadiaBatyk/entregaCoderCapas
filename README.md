# entregaPerformance
## Ejecutar el proyecto:
- modo fork => npm run start
- modo cluster => MODO=cluster npm run start
## Ejecutar el proyecto con 0x:
- 0x init.js


## Conclusiones:
(estan los archivos txt en el codigo)
- el test de carga confirma que cluster es mucho mas eficiente que el fork, fork literalmente se cae al hacer un test de carga elevado, mientras q cluster lo maneja bien. La optimizacion se ve mejor en el endpoint /api/randoms (de ahi estan los txt), pero tambien al realizarla en un endpoint menos exigido como /info.
- los console.logs consumen mucho mas y hacen mas ineficiente la performance del server en endpoints pequeños como /info.
- reporte autocannon (me copa mas q astillery xq la informacion esta mas clara y menos abrumadora)
![autocannon inforeme](https://user-images.githubusercontent.com/77365693/184687211-0479ed1a-08f3-41d0-bad1-f0692375bbec.PNG)

## Node --inspect:
- Hice ambos casos, profiler con los archivos fuente y el node --inspect en consola y si bien es útil ver exactamente que linea de código se puede mejorar o cuanto consume cada funcion, es demasiada data hasta encontrar la causa y con los conocimientos actuales no se puede realizar un analisis exhaustivo de como mejorar la performance de la aplicacion, prefiero verlo en los archivos txt que genera el --prof de node.

### Diagrama de flama
- Esta el html en el código pero para ser sincera, no me pareció fácil de analizar a comparacion de los otros informes, siento que es más comodo y claro verlo en los archivos del profiler de node.
# entregaCoderCapas
