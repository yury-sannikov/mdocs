'use strict';

const argv = require('minimist')(process.argv.slice(2));
import fs from 'fs';
import co from 'co';
import * as commands from './commands';
import JSONStream from 'JSONStream';


function showUsage() {
  const commandsList = Object.keys(commands).map( c=>`    ${c}`).join('\n');
  const helpText = `Usage: automator <command> help\n
  Available commands are:\n${commandsList}`;
  console.error(helpText);
}


function joinOptions(options) {
  const basicOptions = [
    {
      key: '--input-file',
      required: false,
      short: 'file',
      description: 'Input JSON file for processing. Use stdin if omitted'
    },
    {
      key: '--output-file',
      required: false,
      short: 'file',
      description: 'Output JSON file. Output to stdout if omitted'
    }
  ];
  if (!options || !options.length) {
    return basicOptions;
  }
  return [...basicOptions, ...options];
}

function showUsageFor(commandObject) {
  const helpInfo = commandObject.help();
  const options = joinOptions(helpInfo.options).map(o => `${o.key} ${o.required ? '<' : '['}${o.short}${o.required ? '>' : ']'}`).join(' ');
  const longOptions = joinOptions(helpInfo.options).map(o => `\t${o.key} ${o.description}`).join('\n');
  const helpText = `${helpInfo.description}\nUsage: automator ${commandName} ${options}\n${longOptions}`;
  console.error(helpText);
}


if (argv._.length === 0) {
  showUsage();
  process.exit(-1);
}

const commandName = argv._[0];
var commandObject = commands[commandName];

if (!commandObject) {
  console.error(`Unknown command ${commandName}`);
  showUsage();
  process.exit(-2);
}

if (argv._.indexOf('help') !== -1) {
  showUsageFor(commandObject);
  process.exit(0);
}

const inputFile = argv['input-file'];
const inputStream = inputFile ? fs.createReadStream(inputFile, {flags: 'r'}) : process.stdin;
const outputFile = argv['output-file'];
const outputStream = outputFile ? fs.createWriteStream(outputFile, {flags: 'w'}) : process.stdout;

co(function* () {
  const result = yield commandObject.execute(inputStream, argv);
  return result;
}).then(function (stream) {
  stream
    .pipe(JSONStream.stringify())
    .pipe(outputStream);
}, function (err) {
  if (err instanceof TypeError) {
    console.error(err.message);
    showUsageFor(commandObject);
  } else {
    console.error(err.stack);
  }
});
