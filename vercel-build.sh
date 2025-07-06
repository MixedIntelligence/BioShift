#!/bin/bash
# Quick fix for Vercel deployment - disable ESLint warnings as errors
export CI=false
export GENERATE_SOURCEMAP=false
npm run build
