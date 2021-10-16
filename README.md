# Spfx Packaging

## Overview

Type scripts to handle routine tasks with Spfx packages not handled by PnP or sp build tools.

## Content

### incrementVersions

increments the version and `package.json` and then use it in the `package-solution.json` and possible `*.manifest.json`

### generateNewGuidsResetVersions

Resets the version to *0.0.1* and generates new GUIDs in `package-solution.json` and for the component in the `*.manifest.json`.
