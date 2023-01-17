# Plat Overview:

## Who is this solution is intended for?
list primary and secondary user(s) of this app ...

## What is this solution is attempting to solve?
this app is a demonstration on how plat can help ...

## How is this solution addresses the problem?
this app leverages FDX APIs to analyze a customer history ... 

## Similar solutions and what makes this different
banks already have a mechanism to transfer accounts however Plat provides customers incentives to ...


<br>

# Server Implementation & FDX API Usage:
The hackathon will look at documentation. This section is reserved to go over things server related.


<br>

# Account Transfer Incentives
The incentives implemented for this demonstration are as follows:
- When a customer transfers $20,000 to ABC Bank, the customer is offered an inventive of 25 basis points in savings (example: loans) or additional interest (example: deposit accounts). 
- Ideally Plat would use customer information that is not currently part of the FDX API, such as an account open date, to uncover other potential incentives for the customer.


<br>

# Other Notes:

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
