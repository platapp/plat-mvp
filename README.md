## How to run

`npm run install -all`
Note that this needs to be done in both root and server folder.

`npm run build`

`npm run prod-start`
Note that this needs to be done in both root and server folder.

To mock the FDX api, in a separate terminal run `npm run mock-fdx`.

## Development

Both the client and server are typescript apps. The client code is in [src](./src) and uses the React framework.  The server code is in [server](./server).  To transpile the server code run `npm run transpile` from the server directory.  This will create plain javascript files in the `dist` folder.   

To run the mock API server from the parent folder,
`cd server && npm run mock`

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

