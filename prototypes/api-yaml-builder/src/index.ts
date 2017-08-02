// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as colors from 'colors';
import * as fsx from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { ApiYamlWriter } from './ApiYamlWriter';

const myPackageJsonFilename: string = path.resolve(path.join(
  module.filename, '..', '..', 'package.json')
);
const myPackageJson: { version: string } = require(myPackageJsonFilename);

console.log(colors.bold(`api-yaml-builder ${myPackageJson.version}` + os.EOL));

const apiYamlWriter: ApiYamlWriter = new ApiYamlWriter();
const inputFolder: string = path.join(__dirname, '../files/input');
for (const filename of fsx.readdirSync(inputFolder)) {
  if (filename.match(/\.api\.json$/i)) {
    console.log(`Reading ${filename}`);
    const filenamePath: string = path.join(inputFolder, filename);
    apiYamlWriter.loadApiJsonFile(filenamePath);
  }
}

const outputFolder: string = path.join(__dirname, '../files/output');

apiYamlWriter.writeYaml(outputFolder);
