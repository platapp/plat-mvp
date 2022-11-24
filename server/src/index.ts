import Koa from "koa";
import serve from "koa-static";
import Router from '@koa/router'
import { averageTransactions, accountTypes, customerMetrics } from "./scores";
import { fdxServices, fdxAuth } from "./service";

import * as dotenv from 'dotenv'
dotenv.config()

const router = new Router();
const app = new Koa();

const REDIRECT_URL = process.env.REDIRECT_URL as string
const CLIENT_ID = process.env.CLIENT_ID as string
const CLIENT_SECRET = process.env.CLIENT_SECRET as string
const FDX_URL = process.env.FDX_URL as string
const FDX_OIDC_URL = process.env.FDX_OIDC_URL as string

const fdxService = fdxServices(FDX_URL)
const auth = fdxAuth(FDX_OIDC_URL, REDIRECT_URL, CLIENT_ID, CLIENT_SECRET)

export type CustomerScore = Record<string, any>
app.use(router.routes()).use(router.allowedMethods());

router.post('/scores', (ctx, next) => {
    ctx.body = 'Hello World!';
}).get('/accounts', async (ctx, next) => {
    const token = ctx.request.query.token as string
    const scores = await fdxService(token).getAccounts().then(accountTypes)
    ctx.body = scores
}).get('/customer', async (ctx, next) => {
    const token = ctx.request.query.token as string
    const scores = await fdxService(token).getCustomers().then(customer => customerMetrics(customer, new Date()))
    ctx.body = scores
}).get('/transactions', async (ctx, next) => {
    const token = ctx.request.query.token as string
    //this is 10 years for testing, the dates aren't recent on the mock transaction data
    const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
    const fdxWithToken = fdxService(token)
    const scores = await fdxWithToken.getAccounts().then(fdxWithToken.getTransactionsFromAccounts).then(transactions => averageTransactions(transactions, oneYearAgo.toISOString()))
    ctx.body = scores
}).get('/rewards', async (ctx, next) => {
    const token = ctx.request.query.token as string
    const rewards = await fdxService(token).getRewards().then(rewards => rewards.rewardPrograms.map(({ programName, programUrl }) => ({ programName, programUrl })))
    ctx.body = rewards
}).get('/auth', async (ctx, next) => { //on load, client calls this.  If not logged in, redirect to FDX login
    const { code } = ctx.request.query
    if (code) {
        const { accessToken, refreshToken } = await auth(code as string)
        ctx.status = 200;
        ctx.body = { accessToken, refreshToken }
    }
    else {
        ctx.status = 401
    }

})
app.use(serve("../build/"))


app.listen(3001);