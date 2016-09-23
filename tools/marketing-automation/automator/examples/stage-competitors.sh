#!/bin/bash
set -e
./automator competitors --input-file ./doctors-output-s2.json --output-file ./doctors-output-competitors.json --yelp-categories=dentists
# node makeReadable.js 'doctors-output-competitors.json'
