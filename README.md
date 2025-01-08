# i18n Web Collaboration

The easiest way to let others help translate your app

Made with Remix ⚡

## Installation and running with Docker (recommended)

```bash
docker compose up --build
```

## Installation and running

- Install NodeJS v18.18.0 or above
- Install MongoDB server 6.0.12 or above
- Duplicate config.json.example and rename it to config.json
- Change every setting you want on config.json
- Install dependencies by running this command:
```bash
npm run install
```
- Build the webapp
```bash
npm run build
```
- Use the command below to run the webapp using the built-in Remix app server
```bash
npm run start
```

The webapp is now listening at http://localhost:3000

Access http://localhost:3000/setup to create the first admin user.

Now you can pick a host to deploy it to.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
