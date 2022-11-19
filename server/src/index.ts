import Koa from "koa";
import serve from "koa-static";
import Router from '@koa/router'
import { getCustomers, getAccounts, getTransactionsFromAccounts, getRewards } from "./service";
import { averageTransactions, accountTypes, customerMetrics } from "./scores";
const router = new Router();
const app = new Koa();

export type CustomerScore = Record<string, any>
app.use(router.routes()).use(router.allowedMethods());
router.post('/scores', (ctx, next) => {
    ctx.body = 'Hello World!';
}).get('/accounts', async (ctx, next) => {
    const scores = await getAccounts().then(accountTypes)
    ctx.body = scores
}).get('/customer', async (ctx, next) => {
    const scores = await getCustomers().then(customer => customerMetrics(customer, new Date()))
    ctx.body = scores
}).get('/transactions', async (ctx, next) => {
    //this is 10 years for testing, the dates aren't recent on the mock transaction data
    const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
    const scores = await getAccounts().then(getTransactionsFromAccounts).then(transactions => averageTransactions(transactions, oneYearAgo.toISOString()))
    ctx.body = scores
}).get('/rewards', async (ctx, next) => {
    const rewards = await getRewards().then(rewards => rewards.rewardPrograms.map(({ programName, programUrl }) => ({ programName, programUrl })))
    ctx.body = rewards
})
app.use(serve("../build/"));


app.listen(3001);