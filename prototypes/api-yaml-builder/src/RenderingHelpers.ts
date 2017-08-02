// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import {
  IDocMethod,
  IDocItem,
  IDocParam
} from '@microsoft/api-extractor/lib/IDocItem';
import {
  IDocElement,
  ITextElement,
  ILinkDocElement,
  ISeeDocElement
} from '@microsoft/api-extractor/lib/IDocElement';

import {
  IYamlParametersRow
} from './YamlHelperInterfaces';
import {
  IYamlElement,
  IYamlCodeLinkElement,
  IYamlTextElement,
  IYamlHrefElement
} from './IYamlElement';

export class RenderingHelpers {
  /**
   * Used to validate a data structure before writing.  Reports an error if there
   * are any undefined members.
   */
  // tslint:disable-next-line:no-any
  public static validateNoUndefinedMembers(json: any, jsonPath: string = ''): void {
    if (!json) {
      return;
    }
    if (typeof json === 'object') {
      for (const key of Object.keys(json)) {
        const keyWithPath: string = jsonPath + '/' + key;
        // tslint:disable-next-line:no-any
        const value: any = json[key];
        if (value === undefined) {
          throw new Error(`The key "${keyWithPath}" is undefined`);
        }
        RenderingHelpers.validateNoUndefinedMembers(value, keyWithPath);
      }
    }

  }

  public static getPageId(packageName: string, exportName?: string, memberName?: string): string {
    let result: string = RenderingHelpers.getUnscopedPackageName(packageName);
    if (exportName) {
      result += '.' + exportName;
      if (memberName === '__constructor') {
        result += '.' + '-ctor';
      } else if (memberName) {
        result += '.' + memberName;
      }
    }
    return result.toLowerCase();
  }

  public static getUnscopedPackageName(packageName: string): string {
    // If there is a "/", return everything after the last "/"
    return packageName.split('/').slice(-1)[0];
  }

  public static getBetaMessage(isBeta: boolean|undefined): string {
    return isBeta
      ? 'This API is provided as a preview for developers and may change based on feedback that'
        + ' we receive.  Do not use this API in a production environment.'
      : '';
  }

  public static renderDocElement(docElements: IDocElement[] | undefined): IYamlElement[] {
    const result: IYamlElement[] = [];

    for (const docElement of docElements || []) {
      switch (docElement.kind) {
        case 'textDocElement':
          const textDocElement: ITextElement = docElement as ITextElement;
          result.push(
            ...RenderingHelpers.createTextElement(textDocElement.value)
          );
          break;
        case 'linkDocElement':
          const linkDocElement: ILinkDocElement = docElement as ILinkDocElement;
          if (linkDocElement.referenceType === 'code') {
            let linkText: string|undefined = linkDocElement.value;
            if (!linkText) {
              linkText = linkDocElement.exportName;
              if (linkDocElement.memberName) {
                linkText += '.' + linkDocElement.memberName;
              }
            }
            result.push(
              ...RenderingHelpers.createCodeLinkElement(linkText,
                RenderingHelpers.getPageId(linkDocElement.packageName || '', linkDocElement.exportName,
                  linkDocElement.memberName)
              )
            );
          } else {
            result.push(
              {
                elementKind: 'webLink',
                targetUrl: linkDocElement.targetUrl,
                text: linkDocElement.value
              } as IYamlHrefElement
            );
          }
          break;
        case 'seeDocElement':
          const seeDocElement: ISeeDocElement = docElement as ISeeDocElement;
          result.push(
            ...RenderingHelpers.createTextElement('see ') // @todo
          );
          for (const seeYamlElement of RenderingHelpers.renderDocElement(seeDocElement.seeElements)) {
            result.push(seeYamlElement);
          }
          break;
      }
    }

    return result;
  }

  public static getIsDeprecated(docItem: IDocItem): boolean {
    return false;
  }

  public static createCodeLinkElement(text: string, linkedPageId: string): IYamlElement[] {
    return [
      {
        elementKind: 'codeLink',
        linkedPageId: linkedPageId,
        text: text
      } as IYamlCodeLinkElement
    ];
  }

  public static createTextElement(text: string): IYamlElement[] {
    if (!text) {
      return [];
    } else {
      return [
        {
          elementKind: 'text',
          text: text
        } as IYamlTextElement
      ];
    }
  }

  public static getConciseSignature(methodName: string, method: IDocMethod): string {
    return methodName + '(' + Object.keys(method.parameters).join(', ') + ')';
  }

  public static createParametersTable(parameters: { [name: string]: IDocParam }): IYamlParametersRow[] {
    const parametersTable: IYamlParametersRow[] = [];

    for (const parameterName of Object.keys(parameters)) {
      const parameter: IDocParam = parameters[parameterName];
      parametersTable.push(
        {
          parameterColumn: RenderingHelpers.createTextElement(parameterName),
          typeColumn: RenderingHelpers.createTextElement(parameterName),
          descriptionColumn: RenderingHelpers.createTextElement(parameterName),

          isOptional: parameter.isOptional || false,
          isSpread: parameter.isSpread || false
        } as IYamlParametersRow
      );
    }
    return parametersTable;
  }
}
