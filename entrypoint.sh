#!/bin/sh

# clean up the tmp directory
rm /tmp/nitro/*

# Start the portal
npm run dev -- --host 0.0.0.0 --port 5173 --no-open