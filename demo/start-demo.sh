#!/bin/sh

print_help () {
    echo ""
    echo "Usage: sh start-demo.sh"
    echo ""
    echo "Starts a localhost server to use online version of Doppler Editors WebApp."
    echo "You can edit index.html in order to use a different version, see detains in the code."
}

set -e
set -u

cd "$(dirname "$0")"

npx http-server . -o /editors/campaigns/123?dsm_dummy=true\&ew_dummy=true --proxy http://localhost:8080?
