#!/bin/bash
# In order to install AWS cli go http://docs.aws.amazon.com/cli/latest/userguide/installing.html#install-bundle-other-os
set -euo pipefail
set -o errexit
set -o errtrace
mkdir -p mdocs-sitebuilder-s3
AWS_ACCESS_KEY_ID=AKIAJYVOLGU7FGP6LUHQ AWS_SECRET_ACCESS_KEY=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 aws s3 cp s3://mdocs-sitebuilder ./mdocs-sitebuilder-s3 --recursive
PWD=$(echo `pwd -P`"/mdocs-sitebuilder-s3" | sed 's/\//\\\//g')
SEDCMD=s/SITEBUILDER_SOURCE_DIR=.*/SITEBUILDER_SOURCE_DIR=${PWD}/g
cp src/.env src/.env_backup
sed "$SEDCMD" ./src/.env > ./src/.env.tmp
mv ./src/.env.tmp ./src/.env
