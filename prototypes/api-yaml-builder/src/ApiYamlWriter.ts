// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as fsx from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import yaml = require('js-yaml');

import {
  IDocClass,
  IDocPackage,
  IDocMember,
  IDocMethod,
  IDocItem
} from '@microsoft/api-extractor/lib/IDocItem';

import { ApiJsonFile } from './ApiJsonFile';
import {
  IYamlClassPage,
  IYamlPackagePage,
  IYamlMethodPage
} from './YamlPageInterfaces';
import {
  IYamlConstructor,
  IYamlMethodsRow,
  IYamlInterfacesRow,
  IYamlClassesRow,
  IYamlFunctionsRow,
  IYamlEnumsRow
} from './YamlHelperInterfaces';

import { RenderingHelpers } from './RenderingHelpers';

export class ApiYamlWriter {
  private readonly _apiJsonFiles: ApiJsonFile[] = [];
  private _outputFolder: string;

  public loadApiJsonFile(apiJsonFilePath: string): void {
    this._apiJsonFiles.push(ApiJsonFile.loadFromFile(apiJsonFilePath));
  }

  public writeYaml(outputFolder: string): void {
    this._outputFolder = outputFolder;

    // Delete any old YAML files in the output folder
    console.log(os.EOL + 'Deleting old *.yaml files...' + os.EOL);
    for (const filename of fsx.readdirSync(outputFolder)) {
      if (filename.match(/\.yaml$/i)) {
        const filenamePath: string = path.join(outputFolder, filename);
        fsx.removeSync(filenamePath);
      }
    }

    for (const apiJsonFile of this._apiJsonFiles) {
      this._writePackagePage(apiJsonFile);
    }
  }

  private _writeYamlFile(yamlObject: { pageId: string}): void {
    const filePath: string = path.join(this._outputFolder, yamlObject.pageId + '.yaml');

    RenderingHelpers.validateNoUndefinedMembers(yamlObject);
    const stringified: string = yaml.safeDump(yamlObject, {
      lineWidth: 120
    });
    const normalized: string = stringified.split('\n').join('\r\n');
    fsx.writeFileSync(filePath, normalized);
  }

  private _writePackagePage(apiJsonFile: ApiJsonFile): void {
    console.log(`Writing ${apiJsonFile.packageName} package`);

    const docPackage: IDocPackage = apiJsonFile.docPackage;

    const packagePage: IYamlPackagePage = {
      pageSchema: 'package',
      pageId: RenderingHelpers.getPageId(apiJsonFile.packageName),
      title: apiJsonFile.packageName + ' package',
      package: apiJsonFile.packageName,
      deprecatedMessage: docPackage.deprecatedMessage || '',
      betaWarning: RenderingHelpers.getBetaMessage(docPackage.isBeta),
      summary: RenderingHelpers.renderDocElement(docPackage.summary),
      remarks: RenderingHelpers.renderDocElement(docPackage.remarks),

      classesTable: [],
      interfacesTable: [],
      functionsTable: [],
      enumsTable: []
    } as IYamlPackagePage;

    for (const exportName of Object.keys(docPackage.exports)) {
      const docItem: IDocItem = docPackage.exports[exportName];
      switch (docItem.kind) {
        case 'class':
          packagePage.classesTable.push({
            classColumn: RenderingHelpers.createCodeLinkElement(
              exportName,
              RenderingHelpers.getPageId(apiJsonFile.packageName, exportName)
            ),
            descriptionColumn: RenderingHelpers.renderDocElement(docItem.summary),

            isDeprecated: RenderingHelpers.getIsDeprecated(docItem),
            isBeta: docItem.isBeta
          } as IYamlClassesRow);

          this._writeClassPage(docItem, exportName, apiJsonFile);
          break;
        case 'interface':
          packagePage.interfacesTable.push({
            interfaceColumn: RenderingHelpers.createCodeLinkElement(
              exportName,
              RenderingHelpers.getPageId(apiJsonFile.packageName, exportName)
            ),
            descriptionColumn: RenderingHelpers.renderDocElement(docItem.summary),

            isDeprecated: RenderingHelpers.getIsDeprecated(docItem),
            isBeta: docItem.isBeta
          } as IYamlInterfacesRow);
          break;
        case 'function':
          packagePage.functionsTable.push({
            functionColumn: RenderingHelpers.createCodeLinkElement(
              exportName,
              RenderingHelpers.getPageId(apiJsonFile.packageName, exportName)
            ),
            returnsColumn: [],
            descriptionColumn: RenderingHelpers.renderDocElement(docItem.summary),

            isDeprecated: RenderingHelpers.getIsDeprecated(docItem),
            isBeta: docItem.isBeta
          } as IYamlFunctionsRow);
          break;
        case 'enum':
          packagePage.enumsTable.push({
            enumColumn: RenderingHelpers.createCodeLinkElement(
              exportName,
              RenderingHelpers.getPageId(apiJsonFile.packageName, exportName)
            ),
            descriptionColumn: RenderingHelpers.renderDocElement(docItem.summary),

            isDeprecated: RenderingHelpers.getIsDeprecated(docItem),
            isBeta: docItem.isBeta
          } as IYamlEnumsRow);
          break;
      }
    }

    this._writeYamlFile(packagePage);
  }

  private _writeClassPage(docClass: IDocClass, className: string, apiJsonFile: ApiJsonFile): void {

    const classPage: IYamlClassPage = {
      pageSchema: 'class',
      pageId: RenderingHelpers.getPageId(apiJsonFile.packageName, className),
      title: className + ' class',
      package: apiJsonFile.packageName,
      deprecatedMessage: docClass.deprecatedMessage || '',
      betaWarning: RenderingHelpers.getBetaMessage(docClass.isBeta),
      summary: RenderingHelpers.renderDocElement(docClass.summary),
      remarks: RenderingHelpers.renderDocElement(docClass.remarks),

      extends: RenderingHelpers.createTextElement(docClass.extends || ''),
      implements: RenderingHelpers.createTextElement(docClass.implements || ''),
      propertiesTable: [],
      methodsTable: []
    } as IYamlClassPage;

    for (const memberName of Object.keys(docClass.members)) {
      const member: IDocMember = docClass.members[memberName];
      switch (member.kind) {
        // @todo -- pending WBT fix
/*
        case 'constructor':
          classPage.classConstructor = {
            fullSignature: RenderingHelpers.createTextElement(member.signature),
            parametersTable: RenderingHelpers.createParametersTable(member.parameters),
            summary: RenderingHelpers.renderDocElement(member.summary),
            remarks: RenderingHelpers.renderDocElement(member.remarks)
          } as IYamlConstructor;
          break;
*/
        case 'method':
          classPage.methodsTable.push(
            {
              methodColumn: RenderingHelpers.createCodeLinkElement(
                RenderingHelpers.getConciseSignature(memberName, member),
                RenderingHelpers.getPageId(apiJsonFile.packageName, className, memberName)
              ),
              accessModifierColumn: RenderingHelpers.createTextElement(
                member.accessModifier ? member.accessModifier.toString() : ''
              ),
              returnsColumn: member.returnValue ? RenderingHelpers.createTextElement(member.returnValue.type) : [],
              descriptionColumn: RenderingHelpers.renderDocElement(member.summary),

              isDeprecated: RenderingHelpers.getIsDeprecated(member),
              isBeta: member.isBeta,
              isStatic: member.isStatic
            } as IYamlMethodsRow
          );

          this._writeMethodPage(member, memberName, className, apiJsonFile);
          break;
        case 'property':
      }
    }

    this._writeYamlFile(classPage);
  }

  private _writeMethodPage(docMethod: IDocMethod, methodName: string, className: string,
    apiJsonFile: ApiJsonFile): void {

    const fullMethodName: string = className + '.' + methodName;
    const methodPage: IYamlMethodPage = {
      pageSchema: 'method',
      pageId: RenderingHelpers.getPageId(apiJsonFile.packageName, className, methodName),
      title: fullMethodName + ' method',
      package: apiJsonFile.packageName,
      deprecatedMessage: docMethod.deprecatedMessage || '',
      betaWarning: RenderingHelpers.getBetaMessage(docMethod.isBeta),
      summary: RenderingHelpers.renderDocElement(docMethod.summary),
      remarks: RenderingHelpers.renderDocElement(docMethod.remarks),

      fullSignature: RenderingHelpers.createTextElement(docMethod.signature),
      returnType: [],
      returnDescription: [],
      parametersTable: RenderingHelpers.createParametersTable(docMethod.parameters),

      accessModifier: '',
      isStatic: docMethod.isStatic || false
    } as IYamlMethodPage;

    if (docMethod.returnValue) {
      methodPage.returnType = RenderingHelpers.createTextElement(docMethod.returnValue.type);
      methodPage.returnDescription = RenderingHelpers.renderDocElement(docMethod.returnValue.description);
    }

    if (docMethod.accessModifier) {
      methodPage.accessModifier = docMethod.accessModifier.toString();
    }

    this._writeYamlFile(methodPage);
  }

}
