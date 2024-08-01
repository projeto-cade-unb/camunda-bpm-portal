# Plugin Camunda para Portal de Documentação de BPMNs

[![Plugin Type](<https://img.shields.io/badge/Plugin_Type-BPMN_(Camunda_Platform_7)-orange.svg>)](#) ![Compatible with: Camunda Platform 7](https://img.shields.io/badge/Compatible%20with-Camunda%20Platform%207-26d07c) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Este projeto visa construir um portal de documentação de processos integrados ao software Camunda BPM Plataform.
Para um uso de todas funcionalidades deve ser usado em conjunto com o Plugin do Camunda Modeler [WYSIWYG Documentation editor for Camunda Modeler](https://github.com/sharedchains/camunda-wysiwyg-documentation)

## Suporte de Versões.

Este plugin foi homologado e testado na versão 7.20 do Camunda. Suportado por toda versões 7.20 ou superiores.

## Funcionalidades.

- Apresenta última versão do processo do camunda com o elemento description e o elemento complementar de descrição em HTML.
- Navegação visual ao clicar no processo direta para documentação.
- Integrado ao Camunda Cockpit.
- Exemplos de Processos documentados com [WYSIWYG Documentation editor for Camunda Modeler](https://github.com/sharedchains/camunda-wysiwyg-documentation)

## Telas do Camunda BPM Portal.

## Home do Portal.

![image](https://raw.githubusercontent.com/projeto-cade-unb/camunda-bpm-portal/main/samples/img/screenshot_home_camunda-bpm_portal.png)

## Visualização de um Processo com Documentação.

![image](https://raw.githubusercontent.com/projeto-cade-unb/camunda-bpm-portal/main/samples/img/screenshot_processo_camunda_bpm_portal.png)

## Detalhamento da Documentação do Processo.

![image](https://raw.githubusercontent.com/projeto-cade-unb/camunda-bpm-portal/main/samples/img/screenshot-details-camunda-bpm_portal.png)

## Instalação.

### Apache Tomcat.

1. Realise o download o release do plugin na última versão de https://github.com/projeto-cade-unb/camunda-bpm-portal/releases
   exemplo portal-bpm-v0.2.0.zip

1. Descompacte na pasta de script e mova o diretório **portal-bpm** para o seu Camunda Server
   <instal-camunda-path>/server/apache-tomcat-9.0.75/webapps/camunda/app/cockpit/scripts

1. Configurar ao arquivo config.js
   Local do arquico <instal-camunda-path>/server/apache-tomcat-9.0.75/webapps/camunda/app/cockpit/scripts/
   Adicione as linhas abaixo no customScripts

```js
customScripts: ["scripts/portal-bpm/plugin.js"];
```

1. Reinicie seu Camunda.

### Iframe do Youtube

Se a documentação do contem a iframe de uma fonte externa ao Camunda é necessário permitir requisição.

1. Adicione esse código na arquivo `conf/web.xml` do Tomcat para permitir requisições externas para o YouTube:

   - ```xml
      <filter>
         <filter-name>HttpHeaderSecurity</filter-name>
         <filter-class>
            org.camunda.bpm.webapp.impl.security.filter.headersec.HttpHeaderSecurityFilter
         </filter-class>

         <init-param>
            <param-name>contentSecurityPolicyValue</param-name>
            <param-value>
               base-uri 'self';
               default-src 'self' 'unsafe-inline';
               frame-src 'self' https://www.youtube-nocookie.com;
            </param-value>
         </init-param>
      </filter>
     ```

### Apache Tomcat no Linux (Realizando build).

Exemplo em Camunda 7.20.0:

1. Realize o Build (veja sessão Build).

1. Acesse sua pasta de script do cockpit.

```bash
 cd /opt/camunda/camunda-bpm-tomcat-7.20.0/server/apache-tomcat-9.0.75/webapps/camunda/app/cockpit/scripts
```

3. Crie um diretório para seu plugin.

```bash
mkdir portal-bpm
```

4. Copie toda o conteúdo da pasta "dist" para a pasta criada no Camunda Cockpit.

```bash
cp  dist/* -R /opt/camunda/camunda-bpm-tomcat-7.20.0/server/apache-tomcat-9.0.75/webapps/camunda/app/cockpit/scripts/portal-bpm
```

5. Configurar ao arquivo config.js.
   nano /opt/camunda/camunda-bpm-tomcat-7.20.0/server/apache-tomcat-9.0.75/webapps/camunda/app/cockpit/scripts/

```js
customScripts: ["scripts/portal-bpm/plugin.js"];
```

6. Reinicie seu tomcat e limpe o cache do browser.

## Build (Desenvolvedores).

```bash
git clone
npm install
npm run buildPlugin
```

## Roadmap.

### Correções:

- A Documentação geral no element "process" quando apresentada e listada como o elemento start aparentando ter dois starts no fluxo , apresentar este elemento como process.

- Na apresentação de 6 processos as divs da página inicial ficaram quebradas quando a descrição do processo usa duas linhas.

- Apresentar video youtube incorporado. NO WYSIWYG funciona mas no portal não.

- As cores adicionadas no editor, por exemplo vermelho não estão aparecendo no Portal.

### Melhorias:

- i18N - Implementar internacionalização e traduzir em en,de e pt_BR.

- i18N - Traduzir o Plugin WYSIWYG e submeter no github.

- UI: Colocar uma ação para apresentar e esconder a área "Technical details", estas informações não são relevantes para usuários de negócio.

- UI: Colocar o Icone do tipo de Element HTML miniatura antes do nome do Elemento.

- Versionamento: Suporte a visualizar versionamento de processos (criar um select para permitir o usuário selecionar versões anteriores , mostrar poir default sempre a última como está)

- Controle de Acesso: Respeitar controle de acesso do usuário para visibilidade do processo.

- Controle de Acesso: Possibilidade de acesso público configurável (embeeded Camunda BPM Portal)

- UI: Permitir Categorização de BPMNs Exemplo RH , Financeiro, comercial, etc.

- UI: Exportação para PDF ou Doc.

## Contribuições.

Envie sua contribuição via pull request.
