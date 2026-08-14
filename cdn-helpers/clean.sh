#!/bin/sh

# parameters
destination=""
port=""
environment=""
keepDays="7"

print_help () {
    echo ""
    echo "Usage: sh clean.sh [OPTIONS]"
    echo ""
    echo "Clean old CDN files for mutable environments."
    echo ""
    echo "Options:"
    echo "  -d, --destination (mandatory)"
    echo "  -p, --port (Default value: 22)"
    echo "  -e, --environment main|INT|pr (mandatory)"
    echo "  -k, --keep-days (Default value: 7, only for pr)"
    echo "  -h, --help"
    echo ""
    echo "Examples:"
    echo "  sh clean.sh --port=22 --destination=cdndoppler@reporting.fromdoppler.com:/cdndoppler/editors-webapp/ --environment=main"
    echo "  sh clean.sh --port=22 --destination=cdndoppler@reporting.fromdoppler.com:/cdndoppler/editors-webapp/ --environment=pr --keep-days=7"
}

for i in "$@" ; do
case $i in
    -d=*|--destination=*)
    destination="${i#*=}"
    ;;
    -p=*|--port=*)
    port="${i#*=}"
    ;;
    -e=*|--environment=*)
    environment="${i#*=}"
    ;;
    -k=*|--keep-days=*)
    keepDays="${i#*=}"
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

if [ -z "${environment}" ]
then
  echo "Error: environment parameter is mandatory"
  print_help
  exit 1
fi

case "${environment}" in
  main|INT|pr)
    ;;
  *)
    echo "Error: environment must be one of: main, INT, pr"
    print_help
    exit 1
    ;;
esac

case "${keepDays}" in
  ''|*[!0-9]*)
    echo "Error: keep-days must be a positive integer"
    print_help
    exit 1
    ;;
  0)
    echo "Error: keep-days must be greater than zero"
    print_help
    exit 1
    ;;
esac

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

# cSpell:disable
remoteUserAndHost="${destination%:*}"
remotePath="${destination#*:}"
tmpDir="$(mktemp -d)"
manifestDir="${tmpDir}/manifests"
downloadBatch="${tmpDir}/download.batch"
deleteBatch="${tmpDir}/delete.batch"
allManifests="${tmpDir}/all-manifests"
deleteManifests="${tmpDir}/delete-manifests"
keepManifests="${tmpDir}/keep-manifests"
candidateAssets="${tmpDir}/candidate-assets"
protectedAssets="${tmpDir}/protected-assets"
deletableAssets="${tmpDir}/deletable-assets"

trap 'rm -rf "${tmpDir}"' EXIT

mkdir -p "${manifestDir}"

: > "${allManifests}"
: > "${deleteManifests}"
: > "${keepManifests}"
: > "${candidateAssets}"
: > "${protectedAssets}"
: > "${deletableAssets}"

echo "Starting CDN cleanup for ${environment} at ${remotePath}..."
echo "Downloading CDN manifests required for ${environment} cleanup..."

cat > "${downloadBatch}" <<EOF
lcd ${manifestDir}
cd ${remotePath}
mget -p asset-manifest-main.json
mget -p asset-manifest-INT.json
mget -p asset-manifest-v*.json
EOF

if [ "${environment}" = "pr" ]
then
  printf '%s\n' 'mget -p asset-manifest-pr-*.json' >> "${downloadBatch}"
else
  printf 'mget -p asset-manifest-%s-*.json\n' "${environment}" >> "${downloadBatch}"
fi
# cSpell:enable

sftp -P "${port}" -b "${downloadBatch}" "${remoteUserAndHost}" >/dev/null

find "${manifestDir}" -maxdepth 1 -type f -name 'asset-manifest-*.json' -exec basename {} \; \
  | sort > "${allManifests}"

downloadedManifestsCount="$(wc -l < "${allManifests}" | tr -d ' ')"
echo "Downloaded ${downloadedManifestsCount} CDN manifests for analysis."

if [ ! -s "${allManifests}" ]
then
  echo "No CDN manifests found."
  exit 0
fi

if [ "${environment}" = "pr" ]
then
  find "${manifestDir}" -maxdepth 1 -type f -name 'asset-manifest-pr-*.json' -mtime +"${keepDays}" \
    -exec basename {} \; \
    | sort > "${deleteManifests}"
else
  grep -E "^asset-manifest-${environment}-.*\\.json$" "${allManifests}" \
    | sort > "${deleteManifests}" || true
fi

if [ ! -s "${deleteManifests}" ]
then
  echo "No old CDN manifests found for ${environment}."
  exit 0
fi

manifestsToDeleteCount="$(wc -l < "${deleteManifests}" | tr -d ' ')"
echo "Found ${manifestsToDeleteCount} old CDN manifests for ${environment}."

extract_manifest_assets () {
  manifest="$1"

  sed -n 's#.*\(static/\(css\|js\)/[^"?]*\).*$#\1#p' "${manifest}" \
    | while IFS= read -r asset
      do
        [ -n "${asset}" ] || continue

        printf '%s\n' "${asset}"

        case "${asset}" in
          static/js/*.js)
            printf '%s.map\n' "${asset}"
            printf '%s.LICENSE\n' "${asset}"
            printf '%s.LICENSE.txt\n' "${asset}"
            ;;
          static/css/*.css)
            printf '%s.map\n' "${asset}"
            ;;
        esac
      done \
    | sort -u
}

grep -F -x -v -f "${deleteManifests}" "${allManifests}" > "${keepManifests}" || true

while IFS= read -r manifest
do
  extract_manifest_assets "${manifestDir}/${manifest}" >> "${candidateAssets}"
done < "${deleteManifests}"

while IFS= read -r manifest
do
  extract_manifest_assets "${manifestDir}/${manifest}" >> "${protectedAssets}"
done < "${keepManifests}"

sort -u "${candidateAssets}" -o "${candidateAssets}"
sort -u "${protectedAssets}" -o "${protectedAssets}"

if [ -s "${protectedAssets}" ]
then
  grep -F -x -v -f "${protectedAssets}" "${candidateAssets}" > "${deletableAssets}" || true
else
  cp "${candidateAssets}" "${deletableAssets}"
fi

candidateAssetsCount="$(wc -l < "${candidateAssets}" | tr -d ' ')"
keepManifestsCount="$(wc -l < "${keepManifests}" | tr -d ' ')"
protectedAssetsCount="$(wc -l < "${protectedAssets}" | tr -d ' ')"
deletableAssetsCount="$(wc -l < "${deletableAssets}" | tr -d ' ')"

echo "Keeping ${keepManifestsCount} manifests active after cleanup."
echo "Found ${candidateAssetsCount} candidate assets; ${protectedAssetsCount} assets are protected."
echo "Deleting ${manifestsToDeleteCount} manifests and ${deletableAssetsCount} unreferenced assets..."

{
  printf 'cd %s\n' "${remotePath}"

  while IFS= read -r asset
  do
    case "${asset}" in
      static/css/*|static/js/*)
        printf -- '-rm %s\n' "${asset}"
        ;;
    esac
  done < "${deletableAssets}"

  while IFS= read -r manifest
  do
    printf -- '-rm %s\n' "${manifest}"
  done < "${deleteManifests}"
} > "${deleteBatch}"

sftp -P "${port}" -b "${deleteBatch}" "${remoteUserAndHost}" >/dev/null

echo "Deleted ${manifestsToDeleteCount} old CDN manifests and ${deletableAssetsCount} unreferenced manifest assets for ${environment}."
echo "Finished CDN cleanup for ${environment}."
