// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { IYamlElement } from './IYamlElement';

/**
 * A row in the table that shows all packages in the API documentation set.
 */
export interface IYamlPackageRow {
  packageColumn: IYamlElement[];
  descriptionColumn: IYamlElement[];

  isDeprecated: boolean;
  isBeta: boolean;
}

/**
 * Used by the IYamlPackagePage file schema.
 * A row in the table that shows all classes exported by the package.
 */
export interface IYamlClassesRow {
  classColumn: IYamlElement[];
  descriptionColumn: IYamlElement[];

  isDeprecated: boolean;
  isBeta: boolean;
}

/**
 * Used by the IYamlPackagePage file schema.
 * A row in the table that shows all interfaces exported by the package.
 */
export interface IYamlInterfacesRow {
  interfaceColumn: IYamlElement[];
  descriptionColumn: IYamlElement[];

  isDeprecated: boolean;
  isBeta: boolean;
}

/**
 * Used by the IYamlPackagePage file schema.
 * A row in the table that shows all enums exported by the package.
 */
export interface IYamlEnumsRow {
  enumColumn: IYamlElement[];
  descriptionColumn: IYamlElement[];

  isDeprecated: boolean;
  isBeta: boolean;
}

/**
 * Used by the IYamlPackagePage file schema.
 * A row in the table that shows all functions exported by the package.
 */
export interface IYamlFunctionsRow {
  functionColumn: IYamlElement[];
  returnsColumn: IYamlElement[];
  descriptionColumn: IYamlElement[];

  isDeprecated: boolean;
  isBeta: boolean;
}

/**
 * Used by the IYamlClassPage and IYamlInterfacePage file schema.
 * A row in the table that shows all member functions of a class or interface.
 */
export interface IYamlMethodsRow {
  methodColumn: IYamlElement[];
  accessModifierColumn: IYamlElement[];
  returnsColumn: IYamlElement[];
  descriptionColumn: IYamlElement[];

  isDeprecated: boolean;
  isBeta: boolean;
  isStatic: boolean;
}

/**
 * Used by the IYamlClassPage and IYamlInterfacePage file schema.
 * A row in the table that shows all properties functions of a class or interface.
 */
export interface IYamlPropertiesRow {
  propertyColumn: IYamlElement[];
  accessModifierColumn: IYamlElement[];
  typeColumn: IYamlElement[];
  descriptionColumn: IYamlElement[];

  isDeprecated: boolean;
  isBeta: boolean;
  isReadOnly: boolean;
  isStatic: boolean;
}

/**
 * Used by the IYamlEnumPage file schema.
 * A row in the table that shows the members of an enum.
 */
export interface IYamlEnumMembersRow {
  /**
   * The name of the enum member.
   */
  memberColumn: IYamlElement[];
  /**
   * The integer constant for the enum member.
   */
  valueColumn: IYamlElement[];
  descriptionColumn: IYamlElement[];

  isDeprecated: boolean;
  isBeta: boolean;
}

/**
 * Used by the IYamlMethodPage, IYamlFunctionPage, and IYamlConstructor interfaces.
 * A row in the table that shows the parameters of a method, function, or constructor.
 */
export interface IYamlParametersRow {
  parameterColumn: IYamlElement[];
  typeColumn: IYamlElement[];
  descriptionColumn: IYamlElement[];

  isOptional: boolean;
  isSpread: boolean;
}

/**
 * Represents the constructor of a TypeScript class.
 *
 * NOTE: TypeScript classes always have exactly one constructor signature.  There is no
 * detail page for constructors; the IYamlConstructor information is shown on the class's
 * web page.
 */
export interface IYamlConstructor {
  fullSignature: IYamlElement[];
  parametersTable: IYamlParametersRow[];
  summary: IYamlElement[];
  remarks: IYamlElement[];
}
