# Plugin Camunda para Portal de Documentação de BPMNs

 [![Plugin Type](https://img.shields.io/badge/Plugin_Type-BPMN_(Camunda_Platform_7)-orange.svg)](#)

Este projeto visa construir um portal de documentação de processos integrados ao software Camunda BPM Plataform.
Para um uso de todas funcionalidades deve ser usado em conjunto com o Plugin do  Camunda Modeler [WYSIWYG Documentation editor for Camunda Modeler](https://github.com/sharedchains/camunda-wysiwyg-documentation)

## Suporte de Versões.
Este plugin foi homologado e testado na versão 7.20 do Camunda. Suportado por toda versões 7.20 ou Superior

## Funcionalidades.

* Apresenta última versão do processo do camunda com o elemento description e o elemento complementar de descrição em HTML.
* Navegação visual ao clicar no processo direta para documentação.
* Integrado ao Camunda Cockpit. 



## Telas do Camunda BPM Portal.

## Home do Portal.
![image](https://raw.githubusercontent.com/projeto-cade-unb/camunda-bpm-portal/main/samples/img/screenshot_home_camunda-bpm_portal.png)

## Visualização de um Processo com Documentação.
![image](https://raw.githubusercontent.com/projeto-cade-unb/camunda-bpm-portal/main/samples/img/screenshot_processo_camunda_bpm_portal.png)



## Instalação.

### Apache Tomcat. 
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

3) Reinicie seu Camunda.


### Apache Tomcat no Linux (Realizando build).
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

## Build (Desenvolvedores).
git clone 

npm install

npm run buildPlugin

## Road Map.

### Correções:
 * A Documentação geral no element "process" quando apresentada e listada como o elemento start aparentando ter dois starts no fluxo , apresentar este elemento como process.

 * Na apresentação de 6 processos as divs da página inicial ficaram quebradas quando a descrição do processo usa duas linhas.

### Melhorias:
* Versionamento: Suporte a versionamento de processos (criar um select para permitir o usuário selecionar versões anteriores , mostrar poir default sempre a última como está)

* Controle -de Acesso: Respeitar controle de acesso do usuário para visibilidade do processo.

* Possibilidade de acesso público configurável (embeeded Camunda BPM Portal)

## Contribuições.
 Envie sua contribuição via pull request.



