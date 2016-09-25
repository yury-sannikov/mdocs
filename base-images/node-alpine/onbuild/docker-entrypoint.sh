#!/bin/bash
set -euo pipefail
set -o errexit
set -o errtrace

rm -rf /sitebuilder-src
mkdir -p /sitebuilder-src /s3cache
/usr/bin/s3fs mdocs-sitebuilder /sitebuilder-src -ouse_cache=/s3cache -o iam_role=mdocs-apps-ecs-docker-instance-role,nosuid,nonempty,nodev,allow_other,default_acl=private,retries=5

exec "$@"
