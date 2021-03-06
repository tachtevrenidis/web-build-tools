// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * A conservative set of decorators intended for use in both NodeJS and web browser projects.
 * @remarks
 * This package provides a small set of decorators that enable more rigorous specification
 * of API contracts when using the TypeScript language.  The intent is to better document
 * expected behaviors and catch common mistakes.  This package is not intended to be a
 * general toolkit of language extensions or helpful macros.
 */
declare const packageDescription: void; // tslint:disable-line:no-unused-variable

export { virtual } from './virtual';
export { sealed } from './sealed';
export { override } from './override';
