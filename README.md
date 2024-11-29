# Adonojs - sample app

## Back-end

### Technologies

- Postgresql >= 15
- Nodejs >= 20

### Guideline for Configuration

#### Environment variable

- Thêm các biến môi trường vào file ".env" dựa theo các key trong file ".env.example"
- Run command: `node ace generate:key`
- Start with docker: `docker-compose up`

#### Run and debug using VSCode

`package.json`

```json
"scripts": {
    "dev": "node ace serve --hmr",
    "debug": "node ace --inspect=0.0.0.0 serve --watch",
  },
```

`.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Adonis App",
      "type": "node",
      "request": "attach",
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/usr/src/app",
      "port": 9229,
      "address": "localhost",
      "skipFiles": ["<node_internals>/**"],
      "sourceMaps": true
    }
  ]
}
```

`npm run debug`

#### VSCode extension

https://marketplace.visualstudio.com/items?itemName=jripouteau.adonis-vscode-extension
https://marketplace.visualstudio.com/items?itemName=jripouteau.japa-vscode
https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally

#### Config VSCode extension

https://docs.adonisjs.com/guides/digging-deeper/i18n#configuring-the-i18n-ally-vscode-extension
