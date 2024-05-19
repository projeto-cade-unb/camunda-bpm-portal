# Plugin Camunda para Portal de Documentação de BPMNs

 [![Plugin Type](https://img.shields.io/badge/Plugin_Type-BPMN_(Camunda_Platform_7)-orange.svg)](#)

Este projeto visa construir um portal de documentação de Processos integrados ao Software Camunda BPM Plataform.
Para um uso de todas funcionalidades deve ser usado em conjunto com o Plugin do  Camunda Modeler [WYSIWYG Documentation editor for Camunda Modeler](https://github.com/sharedchains/camunda-wysiwyg-documentation)


## Install

### Apache Tomcat 
1) Realise o download o release do plugin na última versão de https://github.com/projeto-cade-unb/camunda-bpm-portal/releases
   exemplo portal-bpm-v0.1.0.zip 

2) Descompacte na pasta de script e mova o diretório **portal-bpm** para o seu Camunda Server
   <instal-camunda-path>/server/apache-tomcat-9.0.75/webapps/camunda/app/cockpit/scripts

3) Configurar ao arquivo config.js
Local do arquico <instal-camunda-path>/server/apache-tomcat-9.0.75/webapps/camunda/app/cockpit/scripts/
Adicione as linhas abaixo no customScripts

 customScripts: [
 'scripts/portal-bpm/plugin.js'
]

3) Reinicie seu Camunda


### Apache Tomcat no Linux (Realizando build)
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

## Build (Desenvolvedores)
git clone 

npm install

npm run buildPlugin


## Funcionalidades

* Apresenta última versão do processo do camunda com o elemento description e o elemento complementar de descrição em HTML.
* Navegação visual ao clicar no processo direta para documentação 


## Telas


## Road Map

### Correções:
 * A Documentação geral no element "process" quando apresentada e listada como o elemento start aparentando ter dois starts no fluxo , apresentar este elemento como process.

### Melhorias
* Versionamento: Suporte a versionamento de processos (criar um select para permitir o usuário selecionar versões anteriores , mostrar poir defaul sempre a última como está)

* Controle -de Acesso: Respeitar controle de acesso do usuário para visibilidade do processo.




## Contribuições.




