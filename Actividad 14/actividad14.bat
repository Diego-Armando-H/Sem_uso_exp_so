@echo off
mkdir "Respaldo"
cd "Respaldo"
mkdir "Documentos"
cd "Documentos"
echo Solo almacenar documentos para tramites y/o documentación >> "readme.md"
cd "../"
mkdir "Imagenes"
cd "Imagenes"
echo Conservar imagernes de importancia no directamente relacionadas a un proyecto (en ese caso generar un proyecto en "documentos"). Se deben crear carpetas diferentes para cada categoría que se necesite por imagenes >> "readme.md"
cd "../"
mkdir "Videos"
cd "Videos"
echo Almacenamiento de videos en general, por cada cosa se debe crear un nuevo directorio en esta misma ruta >> "readme.md"
cd "../"
echo Estructura general para un respaldo, crear nuevas carpetas a conveniencia >> "readme.txt"
@echo on
prompt "Estructura terminada"
@pause