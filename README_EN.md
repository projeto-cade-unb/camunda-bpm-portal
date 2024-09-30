# Camunda Plugin for BPMN Documentation Portal

[![Plugin Type](<https://img.shields.io/badge/Plugin_Type-BPMN_(Camunda_Platform_7)-orange.svg>)](#) ![Compatible with: Camunda Platform 7](https://img.shields.io/badge/Compatible%20with-Camunda%20Platform%207-26d07c) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This project aims to build a process documentation portal integrated with Camunda BPM Platform software. For a full feature use should be used in conjunction with the Camunda Modeler Plugin WYSIWYG Documentation editor for Camunda Modeler

## Version Support.
This plugin has been approved and tested in version 7.20 of Camunda. Supported by all versions 7.20 or higher.

## Features.

- Features latest version of the camunda process with the description element and the HTML description complementary element.
- Visual navigation by clicking on the direct process for documentation.
- Integrated with Camunda Cockpit.
- Examples of Processes Documentation with WYSIWYG Documentation Editor for Camunda Modeler

## Camunda BPM Portal Screenshots.

## Portal Home.
![image](./samples/img/screenshot_home_camunda-bpm_portal.png)

## Visualization of a Process with Documentation.

![image](./samples/img/screenshot_processo_camunda_bpm_portal.png)

## Process Documentation Details.

![image](./samples/img/screenshot-details-camunda-bpm_portal.png)

## Share globally (administrator).
Share access to documentation via **DELETE** and **CREATE** permissions

![image](./samples/img/screenshot-share-admin-camunda-bpm_portal.png)


Access enabled for flows:
- Delivery of School Work
- Invoice Receipt
- the Sample Pizza Process
- Order Pizza
    
## Share globally (user).

Access to documentation with **READ** permission

![image](./samples/img/screenshot-share-user-camunda-bpm_portal.png)

List of shared flows.

## Installation (v0.3.0++).

### Apache Tomcat.

1. Realise the download of the plugin in the latest version of https://github.com/project-cade-unb/camunda-bpm-portal/releases example portal-documentation-v0.3.0.jar

2. Copy to Camunda Server library folder. /server/apache-tomcat-9.0.75/webapps/camunda/WEB-INF/lib

3. Set up a filter on your web.xml in /server/apache-tomcat-9.0.75/webapps/camunda/WEB-INF/


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
          script-src $NONCE 'unsafe-eval' https: 'self' 'unsafe-inline' 'unsafe-hashes';
          script-src-attr 'unsafe-inline';
          style-src 'unsafe-inline' 'self';
          default-src 'self';
          img-src 'self' data:;
          block-all-mixed-content;
          form-action 'self';
          frame-ancestors 'none';
          object-src 'none';
          sandbox allow-forms allow-scripts allow-same-origin allow-popups allow-downloads;
        </param-value>
        </init-param>
     ```

    </filter>


4. Restart your Camunda Server

5. The BPMN Portal will appear in the Cockpit menus.

**ATTENTION** If you have version v0.2.0 of the 'Portal BPM Plugin' in your Camunda, it can be removed! The new version does not need config.js and fonts in the scripts in the app, etc! If you leave it, two menus will appear in the cockpit: Portal BPMN referring to v0.2.0 and Portal Documentation referring to V0.3.0+

Iframe of YouTube

To allow external requests to YouTube in your Camunda application, you will need to add a filter in the file conf/web.xmlfrom Tomcat. Please follow the instructions:

    Open the file conf/web.xml. . .

    Add the following code to allow external requests:

    Build (Developers).

git clone https://github.com/projeto-cade-unb/camunda-bpm-portal.git
cd camunda-bpm-portal
mvn clean install

Roadmap.
Improvements:

    IU: Putting an action to present and hide the "Technical details" area, this information is not relevant to business users.

    UI: Place the Icone of the type of Element HTML thumbnail before the Element name.

    Versioning: Support to view versioning processes (create a select to allow the user to select previous versions, show possible default always the last as is)

    IU: Allow Categorization of BPMNs Example HR, Financial, Commercial, etc.

    UI: Export to PDF or Doc.

Contributions. Contributions.
Send your contribution via pull request.


