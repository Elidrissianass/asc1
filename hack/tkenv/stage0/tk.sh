#!/bin/bash

set -e

e() {
  echo "ERROR: ${BASH_COMMAND}" >&2
}

trap e ERR

STAGE=stage0 kubectl localdev tkenv run
