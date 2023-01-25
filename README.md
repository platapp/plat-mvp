# Plat Overview:

## Who is this solution is intended for?
Plat is an app to allow customers to transfer their bank account and relationships to a new bank (in this example, ABC bank)

## What is this solution is attempting to solve?
Demonstrate relationship portability using open banking and the FDX API

## How is this solution addresses the problem?
Plat leverages FDX APIs to analyze a customer's accounts and transactions. 

## Similar solutions and what makes this different
The closest solutions are account aggregation and authentication using data access platforms, with Finicity offering

## See documentation and context within the /docs folder for a PPTX/PDF
* [Powerpoint Summary](./docs/Plat-Hackathon-Preparation-Materials-2023-01-24-v5.pdf)
* [PDF Summary](./docs/Plat-Hackathon-Preparation-Materials-2023-01-24-v5.pptx)

<br>

# Server Implementation & FDX API Usage:
The hackathon will look at documentation. This section is reserved to go over things server related.

<br>

# Account Transfer Incentives
The incentives implemented for this demonstration are as follows:
- When a customer transfers $20,000 (with exception of LOCs) to ABC Bank, the customer is offered an incentive of 25 basis points in savings (example: loans) or additional interest (example: deposit accounts). 
- Customers who transfers LOCs to ABC Bank are offered an incentive of 25 basis points.
- Ideally Plat would use customer information that is not currently part of the FDX API, such as an account open date, to uncover other potential incentives for the customer.


<br>

# Other Notes:

## How to run

`npm run install-all`

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
