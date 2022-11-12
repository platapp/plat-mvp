import Koa from "koa";
import serve from "koa-static";
import Router from '@koa/router'
import { getCustomers, getTransactions, getAccounts } from "./service";
import { averageTransactions, accountTypes } from "./scores";
const router = new Router();
const app = new Koa();
app.use(serve("../build/"));
app.use(router.routes()).use(router.allowedMethods());
router.post('/scores', (ctx, next) => {
    //todo, implement "calculation" of scores here.  Potentially won't need this
    ctx.body = 'Hello World!';
}).get('/scores', (ctx, next) => {
    //todo, implement the retrieval of scores for consumption by UI
    getCustomers().then(console.log)
    Promise.all([
        getTransactions().then(transactions => averageTransactions(transactions, '2020-03-15T13:29:19+0000')),
        getAccounts().then(accountTypes)
    ]).then(console.log)
    ctx.body = 'Hello World!';
});


app.listen(3000);