# MDOCS Survey

## Prerequisites

- NPM version: 3.10.3
- Node version: 4.4.7

## KOA & JQuery based development

First-time run:

    npm run lubricate

Dev Server:

    npm run start
    open localhost:3030/app

## React based development

Dev Server:

    npm run apps-dev

    wait for: 

    [0] Version: webpack 1.13.1
    [0] Time: 15184ms
    [0]                             Asset     Size  Chunks             Chunk Names
    [0] dashboard-4c3dcae8b1cb1b5faf01.js  4.45 MB       0  [emitted]  dashboard
    [0] webpack built 4c3dcae8b1cb1b5faf01 in 15184ms

    then open localhost:3030/app/dashboard

## Commits

git pre-commit hook runs eslint against scr/apps folder. eslint preconfigured with standard babel/jsx/es7 features.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
