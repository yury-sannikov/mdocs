#!/bin/bash
set -e
rm -rf ./out || true
./automator generate --input-file ./provider-site.json --resource=dentists --output-path=./out
