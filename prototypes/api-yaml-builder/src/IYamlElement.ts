// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * Represents plain text content, similar to HTML to an element body.
 */
export interface IYamlTextElement {
  elementKind: 'text';
  text: string;
}

/**
 * Represents a web hyperlink, similar to an HTML <A> element.
 */
export interface IYamlHrefElement {
  elementKind: 'webLink';
  targetUrl: string;
  text: string;
}

/**
 * Represents a hyperlink to another API page in our documentation system.
 */
export interface IYamlCodeLinkElement {
  elementKind: 'codeLink';
  linkedPageId: string;
  text: string;
}

/**
 * Represents the start of a new paragraph, similar to an HTML <P> tag.
 */
export interface IYamlParagraphElement {
  elementKind: 'paragraph';
}

/**
 * Represents an italicized region, similar to an HTML <I></I> pair.
 */
export interface IYamlItalicsElement {
  elementKind: 'italics';
  childElements: IYamlElement[];
}

/**
 * Represents a region formatted using a fixed-width font, similar to an HTML <PRE></PRE> pair.
 */
export interface IYamlConsoleFontElement {
  elementKind: 'consoleFont';
  childElements: IYamlElement[];
}

/**
 * Represents a block of syntax-highlighted source code, similar to a markdown "```" block.
 */
export interface IYamlCodeBlockElement {
  elementKind: 'codeBlock';
  syntaxHighlighting: 'none' | 'json' | 'javascript' | 'typescript';
  code: string;
}

/**
 * Rich text content is represented as an array of elements, i.e. IYamlElement[].
 */
export type IYamlElement
  = IYamlTextElement
  | IYamlHrefElement
  | IYamlCodeLinkElement
  | IYamlParagraphElement
  | IYamlConsoleFontElement
  | IYamlCodeBlockElement;
