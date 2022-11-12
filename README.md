## How to run

`npm run build`

`cd server && npm install && cd ..`

`npm run prod-start`

## Development

Both the client and server are typescript apps. The client code is in [src](./src) and uses the React framework.  The server code is in [server](./server).  To transpile the server code run `npm run transpile` from the server directory.  This will create plain javascript files in the `dist` folder.   

To run the mock API server,
`cd server && npm run mock`