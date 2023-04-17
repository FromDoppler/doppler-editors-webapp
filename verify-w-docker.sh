#!/bin/sh

# It is only here for reference and backward compatibility, the source of truth
# is doppler-jenkins-ci.groovy

# Stop script on NZEC
set -e
# Stop script if unbound variable found (use ${var:-} if intentional)
set -u

# Lines added to get the script running in the script path shell context
# reference: http://www.ostricher.com/2014/10/the-right-way-to-get-the-directory-of-a-bash-script/
cd "$(dirname "$0")"

# To avoid issues with MINGW and Git Bash, see:
# https://github.com/docker/toolbox/issues/673
# https://gist.github.com/borekb/cb1536a3685ca6fc0ad9a028e6a959e3
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

echo Verify git commit conventions...
sh ./gitlint.sh

echo Verify Format...
docker build --target verify-format .

echo Verify .sh files...
docker build --target verify-sh .

echo Restore...
docker build --target restore .

echo Build...
docker build --target build .

echo Test...
docker build --target test .
