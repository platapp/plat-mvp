## How to run

`npm run install-all`

`npm run build` to create the client code

`npm run server-start` to run the server on port 3001 and go to `http://localhost:3001`


## Development

In development, the dev client runs on 3001 and the dev server on 3002.  The oauth redirect still goes to 3001 on the client and then proxies everything to 3002.

`npm start`

In another terminal, run `npm run server-dev`.

Both the client and server are typescript apps. The client code is in [src](./src) and uses the React framework.  The server code is in [server](./server).  The server code is transpiled into the `dist` folder.   

## Authentication

You need to create two `.env` files, one in the root directory and the other in [server](./server).  The root `.env` should contain the following:

```
REACT_APP_LOGIN_URL="https://tdm.financialdataexchange.org/fdxriauthclient/app/connect"
REACT_APP_CLIENT_ID="[yourclientid]"
```

The `.env` in the server directory should contain the following:

```
REDIRECT_URL="http://127.0.0.1:3001"
CLIENT_ID="[yourclientid]"
CLIENT_SECRET = "[yourclientsecret]"
FDX_URL="https://financialdataexchange-prod.apigee.net/fdx-core-api-v51"
FDX_OIDC_URL="https://tdm.financialdataexchange.org/fdxriauthserver/oauth2/token"
```

