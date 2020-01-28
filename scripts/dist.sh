#!/usr/bin/env bash

rm -rf ./open-rights-verifier-extension
cp -r ./client ./open-rights-verifier-extension
zip open-rights-verifier-extension.zip -r ./open-rights-verifier-extension
rm -rf ./open-rights-verifier-extension
