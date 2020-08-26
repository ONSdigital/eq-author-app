# Debugging (with VS Code)

Follow [this guide](https://github.com/docker/labs/blob/83514855aff21eaed3925d1fd28091b23de0e147/developer-tools/nodejs-debugging/VSCode-README.md) to enable debugging through VS Code.

If you have started the app with `docker-compose` then you can attach a debugger. This is the `launch.json` configuration you must use instead of that detailed in the guide, it will attach _to the running docker container_:

Change the ports with the following:
`eq-publisher` uses port `5859`, `eq-author-api` uses port `5858`

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

## Debugging tests in eq-author-api

Add the following to your `launch.json` configuration:

```json
{
  "name": "Attach by Process ID",
  "type": "node",
  "request": "attach",
  "processId": "${command:PickProcess}"
}
```

Then start your tests [as described above](#running-tests). You can now start a debugging session, and pick the jest process to attach to.
