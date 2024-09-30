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

Access enabled for flows:

    Delivery of School Work
    Invoice Receipt
    the Sample Pizza Process
    Order Pizza
    
Share globally (user).
Access to documentation by READ permission

List of Shared Flows.
Installation (v0.3.0++).
Apache Tomcat.

Realise the download of the plugin in the latest version of https://github.com/project-cade-unb/camunda-bpm-portal/releases example portal-documentation-v0.3.0.jar

Copy to Camunda Server library folder. /server/apache-tomcat-9.0.75/webapps/camunda/WEB-INF/lib

Set up a filter on your web.xml in /server/apache-tomcat-9.0.75/webapps/camunda/WEB-INF/



    Restart your Camunda Server

    The BPMN Portal will appear in the Cockpit menus.

If you have version v0.2.0 of the 'Portal BPM Plugin' in your Camunda, it can be removed! The new version does not need config.js and fonts in the scripts in the app, etc! If you will let two menus appear in the cockpit: BPMN portal referring to v0.2.0 and Portal Documentation for V0.3.0+

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


