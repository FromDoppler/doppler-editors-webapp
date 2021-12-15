#!/bin/sh

# constants
ready="./ready"

# parameters
destination=""
port=""

print_help () {
    echo ""
    echo "Usage: sh upload.sh [OPTIONS]"
    echo ""
    echo "Upload the files from ${ready} folder to our CDN"
    echo ""
    echo "Options:"
    echo "  -d, --destination (mandatory)"
    echo "  -p, --port (Default value: 22)"
    echo
    echo "Examples:"
    echo "  sh upload.sh --port 22 --destination=cdndoppler@reporting.fromdoppler.com:/cdndoppler/editors-webapp/"
}

for i in "$@" ; do
case $i in
    -d=*|--destination=*)
    destination="${i#*=}"
    ;;
    -p=*|--port=*)
    port="${i#*=}"
    ;;
    -h|--help)
    print_help
    exit 0
    ;;
esac
done

if [ -z "${destination}" ]
then
  echo "Error: destination parameter is mandatory"
  print_help
  exit 1
fi

if [ -z "${port}" ]
then
  port=22
fi

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

scp -P "${port}" -r "${ready}/." "${destination}"
