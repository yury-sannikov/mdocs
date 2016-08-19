#!/bin/bash
set -euo pipefail
set -o errexit
set -o errtrace

rm -rf /sitebuilder-src
mkdir -p /sitebuilder-src
/usr/bin/s3fs mdocs-sitebuilder /sitebuilder-src -o iam_role=mdocs-apps-ecs-docker-instance-role,nosuid,nonempty,nodev,allow_other,default_acl=private,retries=5

exec "$@"
