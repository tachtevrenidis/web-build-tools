const path = require('path');
const fs  =require('fs')
const RushLib = require('common/temp/node_modules/@microsoft/rush-lib');

const config = RushLib.RushConfiguration.loadFromDefaultLocation();

config.projects.forEach((project) => {
  const packageJson = require(path.join(project.projectFolder, 'package.json'));

  const sortedDependencies = {};
  Object.keys(packageJson.dependencies).sort().forEach(function(key) {
    sortedDependencies[key] = packageJson.dependencies[key];
  });
  

});