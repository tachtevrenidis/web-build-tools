// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { IYamlElement } from './IYamlElement';
import {
  IYamlClassesRow,
  IYamlInterfacesRow,
  IYamlFunctionsRow,
  IYamlEnumsRow,
  IYamlConstructor,
  IYamlPropertiesRow,
  IYamlMethodsRow,
  IYamlEnumMembersRow,
  IYamlParametersRow
} from './YamlHelperInterfaces';

/**
 * Abstract base interface for root YAML structures describing a documentation page.
 */
export interface IYamlBasePage {
  /**
   * Example: "method"
   */
  pageSchema: string;

  /**
   * Example: "sp-http.httpclient.fetch"
   */
  pageId: string;

  /**
   * Example: "HttpClient.fetch() method"
   */
  title: string;

  /**
   * Example: "@microsoft/sp-http"
   */
  package: string;

  /**
   * If the API item has been deprecated, then this string will be nonempty, and should recommend an
   * alternative.  The API web site should display it as a warning.
   *
   * Example: "The fetch() method will be removed in the next major release.  Use betterFetch() instead."
   */
  deprecatedMessage: string;

  /**
   * If the API item is not intended for production usage, then this string will be nonempty.
   * The API web site should display it as a warning.
   *
   * Example: "This API is provided as a preview for developers and may change based on feedback
   * that we receive.  Do not use this API in a production environment."
   */
  betaWarning: string;

  summary: IYamlElement[];
  remarks: IYamlElement[];
}

/**
 * Describes the schema for a YAML file documenting an NPM package.
 */
export interface IYamlPackagePage extends IYamlBasePage {
  pageSchema: 'package';

  classesTable: IYamlClassesRow[];
  interfacesTable: IYamlInterfacesRow[];
  functionsTable: IYamlFunctionsRow[];
  enumsTable: IYamlEnumsRow[];
}

/**
 * Describes the schema for a YAML file documenting a TypeScript class.
 */
export interface IYamlClassPage extends IYamlBasePage {
  pageSchema: 'class';

  extends: IYamlElement[];
  implements: IYamlElement[];

  classConstructor?: IYamlConstructor;

  propertiesTable: IYamlPropertiesRow[];
  methodsTable: IYamlMethodsRow[];
}

/**
 * Describes the schema for a YAML file documenting a TypeScript interface.
 */
export interface IYamlInterfacePage extends IYamlBasePage {
  pageSchema: 'interface';

  implements: IYamlElement[];

  propertiesTable: IYamlPropertiesRow[];
  methodsTable: IYamlMethodsRow[];
}

/**
 * Describes the schema for a YAML file documenting a TypeScript enum.
 */
export interface IYamlEnumPage extends IYamlBasePage {
  pageSchema: 'enum';

  enumMembersTable: IYamlEnumMembersRow[];
}

/**
 * Describes the schema for a YAML file documenting a member function of a TypeScript class or interface.
 */
export interface IYamlMethodPage extends IYamlBasePage {
  pageSchema: 'method';

  fullSignature: IYamlElement[];
  returnType: IYamlElement[];
  returnDescription: IYamlElement[];
  parametersTable: IYamlParametersRow[];

  accessModifier: string;
  isStatic: boolean;
}

/**
 * Describes the schema for a YAML file documenting a function exported by an NPM package.
 */
export interface IYamlFunctionPage extends IYamlBasePage {
  pageSchema: 'function';

  fullSignature: IYamlElement[];
  returnType: IYamlElement[];
  returnDescription: IYamlElement[];
  parametersTable: IYamlParametersRow[];

  accessModifier: string;
}

/**
 * Describes the schema for a YAML file documenting a property of a TypeScript class or interface.
 * The property getter/setter
 */
export interface IYamlPropertyPage extends IYamlBasePage {
  pageSchema: 'property';

  propertyType: IYamlElement[];

  accessModifier: string;
  isStatic: boolean;
}
