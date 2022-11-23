import Koa from "koa";
import serve from "koa-static";
import Router from '@koa/router'
import { getCustomers, getAccounts, getTransactionsFromAccounts, getRewards, auth } from "./service";
import { averageTransactions, accountTypes, customerMetrics } from "./scores";
import * as dotenv from 'dotenv'
dotenv.config()
const router = new Router();
const app = new Koa();


const REDIRECT_URL = process.env.REDIRECT_URL as string
const CLIENT_ID = process.env.CLIENT_ID as string
const CLIENT_SECRET = process.env.CLIENT_SECRET as string

export type CustomerScore = Record<string, any>
app.use(router.routes()).use(router.allowedMethods());

router.post('/scores', (ctx, next) => {
    ctx.body = 'Hello World!';
}).get('/accounts', async (ctx, next) => {
    const token = ctx.request.query.token as string
    const scores = await getAccounts(token).then(accountTypes)
    ctx.body = scores
}).get('/customer', async (ctx, next) => {
    const token = ctx.request.query.token as string
    const scores = await getCustomers(token).then(customer => customerMetrics(customer, new Date()))
    ctx.body = scores
}).get('/transactions', async (ctx, next) => {
    const token = ctx.request.query.token as string
    //this is 10 years for testing, the dates aren't recent on the mock transaction data
    const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
    const scores = await getAccounts(token).then(accounts => getTransactionsFromAccounts(token, accounts)).then(transactions => averageTransactions(transactions, oneYearAgo.toISOString()))
    ctx.body = scores
}).get('/rewards', async (ctx, next) => {
    const token = ctx.request.query.token as string
    const rewards = await getRewards(token).then(rewards => rewards.rewardPrograms.map(({ programName, programUrl }) => ({ programName, programUrl })))
    ctx.body = rewards
}).get('/auth', async (ctx, next) => { //on load, client calls this.  If not logged in, redirect to FDX login
    const { code } = ctx.request.query
    if (code) {
        const { accessToken, refreshToken } = await auth(code as string, REDIRECT_URL, CLIENT_ID, CLIENT_SECRET)
        ctx.status = 200;
        ctx.body = { accessToken, refreshToken }
    }
    else {
        ctx.status = 401
    }

})
app.use(serve("../build/"))


app.listen(3001);