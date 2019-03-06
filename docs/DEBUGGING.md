# Debugging

If you have started the app with `docker-compose` then you can attach a debugger. If you use vscode, this is the `launch.json` configuration you must use:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Container",
      "type": "node",
      "request": "attach",
      "port": 5859,
      "address": "localhost",
      "restart": true,
      "sourceMaps": false,
      "localRoot": "${workspaceRoot}",
      "remoteRoot": "/app",
      "protocol": "inspector"
    }
  ]
}
```