# Plugin Camunda para Portal de Documentação de BPMNs

 [![Plugin Type](https://img.shields.io/badge/Plugin_Type-BPMN_(Camunda_Platform_7)-orange.svg)](#)

Este projeto visa construir um portal de documentação de Processos integrados ao Software Camunda BPM Plataform

## Build
git clone 

npm install

npm run buildPlugin

## Install

## Apache Tomcat 
1) baixe o release do plugin na última versão de 
2) 


## Apache Tomcat no Linux (com build)
Exemplo em Camunda 7.20.0:

1) realize o Build (veja sessão Build)

2) acesse sua pasta de script do cockpit
 cd /opt/camunda/camunda-bpm-tomcat-7.20.0/server/apache-tomcat-9.0.75/webapps/camunda/app/cockpit/scripts

3) Crie um diratório para seu plugin 
mkdir portal-bpm

4) Copie toda a pasta dist para a past criada no camunda cockpit

cp  dist/* -R /opt/camunda/camunda-bpm-tomcat-7.20.0/server/apache-tomcat-9.0.75/webapps/camunda/app/cockpit/scripts/portal-bpm

5) Configurar ao arquivo config.js
nano /opt/camunda/camunda-bpm-tomcat-7.20.0/server/apache-tomcat-9.0.75/webapps/camunda/app/cockpit/scripts/

 customScripts: [
 'scripts/portal-bpm/plugin.js'
]
6) Reinicie seu tomcat e limpe o cache do browser.

## Funcionalidades


## Telas


## Contribuições.




