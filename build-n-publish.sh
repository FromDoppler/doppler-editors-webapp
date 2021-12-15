#!/bin/sh

pkgName="editors-webapp"
cdnBaseUrl="https://cdn.fromdoppler.com"
commit=""
name=""
version=""
versionPre=""

print_help () {
    echo ""
    echo "Usage: sh build-n-publish.sh [OPTIONS]"
    echo ""
    echo "Use Docker to build project's bundle files and publish them to our CDN"
    echo ""
    echo "Options:"
    echo "  -p, --package, package name (optional, default: ${pkgName})"
    echo "  -b, --cdn-base-url, CDN base URL (optional, default: ${cdnBaseUrl})"
    echo "  -c, --commit (mandatory)"
    echo "  -n, --name, version name"
    echo "  -v, --version, version number"
    echo "  -s, --pre-version-suffix (optional, only with version)"
    echo "  -h, --help"
    echo "Only one of name or version parameters is required, and cannot be included together."
    echo
    echo "Examples:"
    echo "  sh build-n-publish.sh --commit=aee25c286a7c8265e2b32ccc293f5ab0bd7a9d57 --version=v1.2.11"
    echo "  sh build-n-publish.sh --commit=e247ba0527665eb9dd7ffbff00bb42e5073cd457 --version=v0.0.0 --pre-version-suffix=commit-e247ba0527665eb9dd7ffbff00bb42e5073cd457"
    echo "  sh build-n-publish.sh -c=94f85efb9c3689f409104ef7cde6813652ca59fb -v=v12.34.5"
    echo "  sh build-n-publish.sh -c=94f85efb9c3689f409104ef7cde6813652ca59fb -v=v12.34.5 -s=beta1"
    echo "  sh build-n-publish.sh -c=94f85efb9c3689f409104ef7cde6813652ca59fb -v=v12.34.5 -s=pr123"
}

for i in "$@" ; do
case $i in
    -p=*|--package=*)
    pkgName="${i#*=}"
    ;;
    -b=*|--cdn-base-url=*)
    cdnBaseUrl="${i#*=}"
    ;;
    -c=*|--commit=*)
    commit="${i#*=}"
    ;;
    -n=*|--name=*)
    name="${i#*=}"
    ;;
    -v=*|--version=*)
    version="${i#*=}"
    ;;
    -s=*|--pre-version-suffix=*)
    versionPre="${i#*=}"
    ;;
    -h|--help)
    print_help
    exit 0
    ;;
esac
done

if [ -z "${pkgName}" ]
then
  echo "Error: package parameter is mandatory"
  print_help
  exit 1
fi

if [ -z "${cdnBaseUrl}" ]
then
  echo "Error: CDN base URL parameter is mandatory"
  print_help
  exit 1
fi

if [ -z "${commit}" ]
then
  echo "Error: commit parameter is mandatory"
  print_help
  exit 1
fi

if [ -n "${version}" ] && [ -n "${name}" ]
then
  echo "Error: name and version parameters cannot be included together"
  print_help
  exit 1
fi

if [ -z "${version}" ] && [ -z "${name}" ]
then
  echo "Error: one of name or version parameters is required"
  print_help
  exit 1
fi

if [ -z "${version}" ] && [ -n "${versionPre}" ]
then
  echo "Error: pre-version-suffix parameter is only accepted along with version parameter"
  print_help
  exit 1
fi

# TODO: validate commit format
# TODO: validate version format (if it is included)

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

tag="${pkgName}-${commit}"

docker build . \
  --tag "${tag}" \
  --build-arg public_url="${cdnBaseUrl}/${pkgName}/" \

docker run --rm \
  -v /var/lib/jenkins/.ssh:/root/.ssh:ro \
  "${tag}" \
  /bin/sh -c "\
    sh ./prepare.sh \
      --commit=\"${commit}\" \
      --name=\"${name}\" \
      --version=\"${version}\" \
      --pre-version-suffix=\"${versionPre}\" \
    && sh ./upload.sh \
      --port=\"${CDN_SFTP_PORT}\" \
      --destination=\"${CDN_SFTP_USERNAME}@${CDN_SFTP_HOSTNAME}:/${CDN_SFTP_BASE}/${pkgName}/\" \
    "
