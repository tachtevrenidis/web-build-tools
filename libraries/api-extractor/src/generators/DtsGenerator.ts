// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as fs from 'fs';
import Extractor from '../Extractor';
import ApiStructuredType from '../definitions/ApiStructuredType';
import ApiEnum from '../definitions/ApiEnum';
import ApiEnumValue from '../definitions/ApiEnumValue';
import ApiFunction from '../definitions/ApiFunction';
import ApiItem, { ApiItemKind } from '../definitions/ApiItem';
import ApiItemVisitor from '../ApiItemVisitor';
import ApiPackage from '../definitions/ApiPackage';
import ApiParameter from '../definitions/ApiParameter';
import ApiMember from '../definitions/ApiMember';
import ApiNamespace from '../definitions/ApiNamespace';
import ApiModuleVariable from '../definitions/ApiModuleVariable';
import IndentedWriter from '../IndentedWriter';

/**
 * For a library such as "example-package", ApiFileGenerator generates the "example-package.api.ts"
 * report which is used to detect API changes.  The output is pseudocode whose syntax is similar
 * but not identical to a "*.d.ts" typings file.  The output file is designed to be committed to
 * Git with a branch policy that will trigger an API review workflow whenever the file contents
 * have changed.  For example, the API file indicates *whether* a class has been documented,
 * but it does not include the documentation text (since minor text changes should not require
 * an API review).
 *
 * @public
 */
export default class DtsGenerator extends ApiItemVisitor {
  protected _indentedWriter: IndentedWriter = new IndentedWriter();

  /**
   * Generates the report and writes it to disk.
   *
   * @param reportFilename - The output filename
   * @param analyzer       - An Analyzer object representing the input project.
   */
  public writeDtsFile(reportFilename: string, extractor: Extractor): void {
    const fileContent: string = this.generateDtsFileContent(extractor);
    fs.writeFileSync(reportFilename, fileContent);
  }

  public generateDtsFileContent(extractor: Extractor): string {
    // Normalize to CRLF
    this.visit(extractor.package);
    const fileContent: string = this._indentedWriter.toString().replace(/\r?\n/g, '\r\n');
    return fileContent;
  }

  protected visitApiStructuredType(apiStructuredType: ApiStructuredType): void {
    const declarationLine: string = apiStructuredType.getDeclarationLine();

    if (apiStructuredType.kind !== ApiItemKind.TypeLiteral) {
      this._writeJsdoc(apiStructuredType);
    }

    this._indentedWriter.writeLine(declarationLine + ' {');

    this._indentedWriter.indentScope(() => {
      for (const member of apiStructuredType.getSortedMemberItems()) {
        this.visit(member);
        this._indentedWriter.writeLine();
      }
    });

    this._indentedWriter.write('}');
  }

  protected visitApiEnum(apiEnum: ApiEnum): void {
    this._writeJsdoc(apiEnum);

    this._indentedWriter.writeLine(`enum ${apiEnum.name} {`);

    this._indentedWriter.indentScope(() => {
      const members: ApiItem[] = apiEnum.getSortedMemberItems();
      for (let i: number = 0; i < members.length; ++i) {
        this.visit(members[i]);
        this._indentedWriter.writeLine(i < members.length - 1 ? ',' : '');
      }
    });

    this._indentedWriter.write('}');
  }

  protected visitApiEnumValue(apiEnumValue: ApiEnumValue): void {
    this._writeJsdoc(apiEnumValue);

    this._indentedWriter.write(apiEnumValue.getDeclarationLine());
  }

  protected visitApiPackage(apiPackage: ApiPackage): void {
    this._writeComment(apiPackage.name);
    if (apiPackage.documentation.originalAedoc) {
      this._indentedWriter.writeLine();
      this._writeComment(apiPackage.documentation.originalAedoc);
    }
    this._indentedWriter.writeLine();

    for (const apiItem of apiPackage.getSortedMemberItems()) {
      this.visit(apiItem);
      this._indentedWriter.writeLine();
      this._indentedWriter.writeLine();
    }
  }

  protected visitApiNamespace(apiNamespace: ApiNamespace): void {
    this._writeJsdoc(apiNamespace);

    // We have decided to call the apiNamespace a 'module' in our
    // public API documentation.
    this._indentedWriter.writeLine(`module ${apiNamespace.name} {`);

    this._indentedWriter.indentScope(() => {
      for (const apiItem of apiNamespace.getSortedMemberItems()) {
        this.visit(apiItem);
        this._indentedWriter.writeLine();
        this._indentedWriter.writeLine();
      }
    });

    this._indentedWriter.write('}');
  }

  protected visitApiModuleVariable(apiModuleVariable: ApiModuleVariable): void {
    this._writeJsdoc(apiModuleVariable);

    this._indentedWriter.write(`${apiModuleVariable.name}: ${apiModuleVariable.type} = ${apiModuleVariable.value};`);
  }

  protected visitApiMember(apiMember: ApiMember): void {
    if (apiMember.documentation) {
      this._writeJsdoc(apiMember);
    }

    this._indentedWriter.write(apiMember.getDeclarationLine());

    if (apiMember.typeLiteral) {
      this.visit(apiMember.typeLiteral);
    }
  }

  protected visitApiFunction(apiFunction: ApiFunction): void {
    this._writeJsdoc(apiFunction);
    this._indentedWriter.write(apiFunction.getDeclarationLine());
  }

  protected visitApiParam(apiParam: ApiParameter): void {
    throw Error('Not Implemented');
  }

  private _writeJsdoc(apiItem: ApiItem): void {
    const aedoc: string = apiItem.documentation.originalAedoc;
    if (aedoc) {
      this._indentedWriter.writeLine();
      this._indentedWriter.writeLine('/**');
      for (const line of aedoc.split('\n')) {
        this._indentedWriter.writeLine(' * ' + line);
      }
      this._indentedWriter.writeLine(' */');
    }
  }

  private _writeComment(commentText: string): void {
    if (commentText) {
      for (const line of commentText.split('\n')) {
        this._indentedWriter.writeLine('// ' + line);
      }
    }
  }
}
