#!/bin/bash
set -e
./automator getsites --input-file ./doctors-input-s2.json --output-file ./doctors-output-s2.json --selector providers.*
node makeReadable.js 'doctors-output-s2.json'
