# runcmd README

Automatically execute pre-installed commands set up by the user, for example, the 'dotnet watch run' command.

## Guide

Use the shortcut **Ctrl + ,** to open **settings.json** and add the necessary generate command.

example:

"runCMD.commands": [
        {
            "command": "dotnet watch run --no-host-reload",
            "name": "Build API",
            "auto": true,
            "preserve": true,
        },
        {
            "command": "ng s --o",
            "name": "Build SPA",
            "auto": true,
            "preserve": true,
        },
        {
            "command": "ng s --o --hmr",
            "name": "Build SPA HMR",
            "auto": true,
            "preserve": false,
        },

Add **"auto": true**, to enable automatic execution,
**"preserve": true**, to prevent it from being overwritten if another command is run additionally.

### 1.0.0

Initial release of ...

**Enjoy!**
