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
const PORT = process.env.PORT || "3001"

const fdxService = fdxServices(FDX_URL)
const auth = fdxAuth(FDX_OIDC_URL, REDIRECT_URL, CLIENT_ID, CLIENT_SECRET)

export type CustomerScore = Record<string, any>
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx, next) => {
    ctx.status = 200
    console.log('Setting status')
    // Call the next middleware, wait for it to complete
    await next()
})

const TOKEN_NAME = "token"
const REFRESH_TOKEN_NAME = "refresh_token"
const setCookies = (
    ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & Router.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>, unknown>,
    accessToken: string,
    refreshToken: string
) => {
    ctx.cookies.set(TOKEN_NAME, accessToken, { httpOnly: true, maxAge: 3000 }); //expire after an hour
    ctx.cookies.set(REFRESH_TOKEN_NAME, refreshToken, { httpOnly: false, maxAge: 500000 }); //expire later than access token
}
const cookieMiddleware = async (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & Router.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>, unknown>, next: Koa.Next) => {
    const accessToken = ctx.cookies.get(TOKEN_NAME)
    const refreshToken = ctx.cookies.get(REFRESH_TOKEN_NAME)
    if (accessToken) {
        return next()
    }
    else if (refreshToken) {
        console.log(refreshToken)
        const result = await auth.refresh(refreshToken)
        console.log(result)
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result
        setCookies(ctx, newAccessToken, newRefreshToken)
        return next()
    }
    else {
        ctx.status = 401
    }
}


router.post('/scores', (ctx) => {
    ctx.body = 'Hello World!';
}).get('/accounts', cookieMiddleware, async (ctx) => {
    const token = ctx.cookies.get(TOKEN_NAME) as string
    const scores = await fdxService(token).getAccounts().then(accountTypes)
    ctx.body = scores

}).get('/customer', cookieMiddleware, async (ctx) => {
    const token = ctx.cookies.get(TOKEN_NAME) as string
    const scores = await fdxService(token).getCustomers().then(customer => customerMetrics(customer, new Date()))
    ctx.body = scores
}).get('/transactions', cookieMiddleware, async (ctx) => {
    const token = ctx.cookies.get(TOKEN_NAME) as string
    //this is 10 years for testing, the dates aren't recent on the mock transaction data
    const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
    const fdxWithToken = fdxService(token)
    const scores = await fdxWithToken.getAccounts().then(fdxWithToken.getTransactionsFromAccounts).then(transactions => averageTransactions(transactions, oneYearAgo.toISOString()))
    ctx.body = scores
}).get('/rewards', cookieMiddleware, async (ctx) => {
    const token = ctx.cookies.get(TOKEN_NAME) as string
    const rewards = await fdxService(token).getRewards().then(rewards => rewards.rewardPrograms.map(({ programName, programUrl }) => ({ programName, programUrl })))
    ctx.body = rewards
}).get('/auth', async (ctx) => { //on load, client calls this.  If not logged in, redirect to FDX login
    const { code } = ctx.request.query
    if (code) {
        const { accessToken, refreshToken } = await auth.auth(code as string)
        ctx.status = 200;
        ctx.cookies.set(TOKEN_NAME, accessToken, { httpOnly: true, maxAge: 3000 }); //expire after an hour
        ctx.cookies.set(REFRESH_TOKEN_NAME, refreshToken, { httpOnly: false, maxAge: 5000 }); //expire later than access token
        //ctx.body = { accessToken, refreshToken }
    }
    else {
        ctx.status = 401
    }

})
app.use(serve("../build/"))


app.listen(PORT);