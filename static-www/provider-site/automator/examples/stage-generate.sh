#!/bin/bash
set -e
rm -rf ./out || true
./automator generate --input-file ./doctors-output-competitors.json --resource=dentists --output-path=./out
