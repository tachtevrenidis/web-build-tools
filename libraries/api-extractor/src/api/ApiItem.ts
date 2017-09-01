// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { IDocElement } from '../markupItem/OldMarkupItem';

/**
 * Whether the function is public, private, or protected.
 * @alpha
 */
export type AccessModifier = 'public' | 'private' | 'protected' | '';

/**
 * The enum value of an IDocEnum.
 *
 * IDocEnumValue does not extend the IDocITem base class
 * because the summary is not required.
 * @alpha
 */
export interface IDocEnumValue {
  value: string;
  summary?: IDocElement[];
  remarks?: IDocElement[];
  deprecatedMessage?: IDocElement[];
}

/**
 * Parameter Doc item.
 * @alpha
 */
export interface IDocParam {
  /**
   * the parameter name
   */
  name: string;

  /**
   * describes the parameter
   */
  description: IDocElement[];

  /**
   * Whether the parameter is optional
   */
  isOptional: boolean;

  /**
   * Whether the parameter has the '...' spread suffix
   */
  isSpread: boolean;

  /**
   * The data type of the parameter
   */
  type: string;
}

/**
 * Return value of a method or function.
 * @alpha
 */
export interface IDocReturnValue {
  /**
   * The data type returned by the function
   */
  type: string;

  /**
   * Describes the return value
   */
  description: IDocElement[];
}

/**
 * DocItems are the typescript adaption of the json schemas
 * defined in API-json-schema.json. IDocElement is a component
 * for IDocItems because they represent formated rich text.
 *
 * This is the base class for other DocItem types.
 * @alpha
 */
export interface IDocBase {
  /**
   * kind of DocItem. Ex: 'class', 'Enum', 'Function', etc.
   */
  kind: string;
  isBeta: boolean;
  summary: IDocElement[];
  remarks?: IDocElement[];
  deprecatedMessage?: IDocElement[];
}

/**
 * A property of a TypeScript class or interface
 * @alpha
 */
export interface IDocProperty extends IDocBase {

  /**
   * {@inheritdoc IDocBase.kind}
   */
  kind: 'property';
  /**
   * For an interface member, whether it is optional
   */
  isOptional: boolean;

  /**
   * Whether the property is read-only
   */
  isReadOnly: boolean;

  /**
   * For a class member, whether it is static
   */
  isStatic: boolean;

  /**
   * The data type of this property
   */
  type: string;
}

/**
 * A member function of a typescript class or interface.
 * @alpha
 */
export interface IDocMethod extends IDocBase {
  /**
   * {@inheritdoc IDocBase.kind}
   */
  kind: 'method';
  /**
   * a text summary of the method definition
   */
  signature: string;

  /**
   * the access modifier of the method
   */
  accessModifier: AccessModifier;

  /**
   * for an interface member, whether it is optional
   */
  isOptional: boolean;

  /**
   * for a class member, whether it is static
   */
  isStatic: boolean;

  /**
   * a mapping of parameter name to IDocParam
   */

  parameters: { [name: string]: IDocParam};

  /**
   * describes the return value of the method
   */
  returnValue: IDocReturnValue;
}

/**
 * A Typescript function.
 * @alpha
 */
export interface IDocFunction extends IDocBase {
  /**
   * {@inheritdoc IDocBase.kind}
   */
  kind: 'function';
  /**
   * parameters of the function
   */
  parameters: { [name: string]: IDocParam};

  /**
   * a description of the return value
   */
  returnValue: IDocReturnValue;
}

/**
 * IDocClass represetns an exported class.
 * @alpha
 */
export interface IDocClass extends IDocBase {
  /**
   * {@inheritdoc IDocBase.kind}
   */
  kind: 'class';
  /**
   * Can be a combination of methods and/or properties
   */
  members: { [name: string]: IDocMember};

  /**
   * Interfaces implemented by this class
   */
  implements?: string;

  /**
   * The base class for this class
   */
  extends?: string;

  /**
   * Generic type parameters for this class
   */
  typeParameters?: string[];
}

/**
 * IDocEnum represents an exported enum.
 * @alpha
 */
export interface IDocEnum extends IDocBase {
  /**
   * {@inheritdoc IDocBase.kind}
   */
  kind: 'enum';

  values: IDocEnumValue[];
}

/**
 * IDocInterface represents an exported interface.
 * @alpha
 */
export interface IDocInterface extends IDocBase {
  /**
   * {@inheritdoc IDocBase.kind}
   */
  kind: 'interface';
  /**
   * A mapping from the name of a member API to its IDocMember
   */
  members: { [name: string]: IDocMember};

  /**
   * Interfaces implemented by this interface
   */
  implements?: string;

  /**
   * The base interface for this interface
   */
  extends?: string;

  /**
   * Generic type parameters for this interface
   */
  typeParameters?: string[];
}

/**
 * IDocPackage is an object contaning the exported
 * definions of this API package. The exports can include:
 * classes, interfaces, enums, functions.
 * @alpha
 */
export interface IDocPackage {
   /**
   * {@inheritdoc IDocBase.kind}
   */
  kind: 'package';

  /**
   * IDocItems of exported API items
   */
  exports: { [name: string]: IDocItem};

  /**
   * The following are needed so that this interface and can share
   * common properties with others that extend IDocBase. The IDocPackage
   * does not extend the IDocBase because a summary is not required for
   * a package.
   */
  isBeta?: boolean;
  summary?: IDocElement[];
  remarks?: IDocElement[];
  deprecatedMessage?: IDocElement[];
}

/**
 * A member of a class.
 * @alpha
 */
export type IDocMember = IDocProperty | IDocMethod;

/**
 * @alpha
 */
export type IDocItem = IDocProperty | IDocMember | IDocFunction |
   IDocClass |IDocEnum | IDocInterface | IDocPackage;

/**
 * An element that represents a param and relevant information to its use.
 *
 * Example:
 * @param1 httpClient - description of httpClient {@link http://website.com}
 * ->
 * {
 *  name: httpClient,
 *  description: [
 *      {kind: 'textDocElement', value: 'description of httpClient'},
 *      {kind: 'linkDocElement', targetUrl: 'http://website.com}
 *   ]
 * }
 *
 * @alpha
 */
export interface IParam {
  name: string;
  description: IDocElement[];
  isOptional?: boolean; // Used by ApiJsonGenerator
  isSpread?: boolean; // Used by ApiJsonGenerator
  type?: string; // Used by ApiJsonGenerator
}

/**
 * Describes a return type and description of the return type
 * that is given in documentation comments.
 *
 * @alpha
 */
export interface IReturn {
  type: string;
  description: IDocElement[];
}