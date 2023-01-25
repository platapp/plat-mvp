import Koa from "koa";
const send = require('koa-send')
import Router from '@koa/router'
import { averageTransactions, accountTypes } from "./scores";
import { fdxServices, fdxAuth } from "./service";
import * as dotenv from 'dotenv'
import path from 'path'
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

const getTokenName = (bank: string) => `token_${bank}`

const getRefreshTokenName = (bank: string) => `refresh_token_${bank}`
const setCookies = (
    ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & Router.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>, unknown>,
    bank: string,
    accessToken: string,
    refreshToken: string
) => {
    const tokenName = getTokenName(bank)
    const refreshTokenName = getRefreshTokenName(bank)
    // secure should be `true` in production
    ctx.cookies.set(tokenName, accessToken, { secure: false, httpOnly: false, maxAge: 3600000 }); //expire after an hour

    // expire later than access token so that if user is playing around in the app it doesn't redirect to login
    // secure should be `true` in production
    ctx.cookies.set(refreshTokenName, refreshToken, { secure: false, httpOnly: false, maxAge: 3700000 });
}
const getToken = (
    ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & Router.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>, unknown>,
) => {
    const bank = ctx.request.query.bank as string
    const tokenName = getTokenName(bank)
    return ctx.cookies.get(tokenName) || ctx.state.accessToken as string
}
const cookieMiddleware = async (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & Router.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>, unknown>, next: Koa.Next) => {
    const bank = ctx.request.query.bank as string
    const tokenName = getTokenName(bank)
    const refreshTokenName = getRefreshTokenName(bank)
    const accessToken = ctx.cookies.get(tokenName)
    const refreshToken = ctx.cookies.get(refreshTokenName)

    if (accessToken) {
        return next()
    }
    else if (refreshToken) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await auth.refresh(refreshToken)
        setCookies(ctx, bank, newAccessToken, newRefreshToken)
        ctx.state.accessToken = newAccessToken
        return next()
    }
    else {
        ctx.status = 401
    }
}

// see ../../src/state/bankLogin.tsx
// harcoding bank names like this would not be required in 
// a "production" application where each bank was an FDX member
const BANK_NAMES = [
    "Bank of Republic",
    "Belieber Bank",
    "Buried and Me National Bank",
    "End of the World as we Grow It Financial",
    "Fade to Black Credit Union",
    "Banco de Hotel California"
]

router.post('/scores', (ctx) => {
    ctx.body = 'Hello World!';
}).get('/accounts', cookieMiddleware, async (ctx) => {
    const token = getToken(ctx)
    const fdxWithToken = fdxService(token)
    const accounts = await fdxWithToken.getAccounts()
    const statements = await fdxWithToken.getStatementsFromAccounts(accounts)
    const scores = accountTypes(accounts, statements)
    ctx.body = scores
}).get('/customer', cookieMiddleware, async (ctx) => {
    const token = getToken(ctx)
    const scores = await fdxService(token).getCustomers()
    ctx.body = scores
}).get('/transactions', cookieMiddleware, async (ctx) => {
    const token = getToken(ctx)
    //this is 10 years for testing, the dates aren't recent on the mock transaction data
    const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
    const fdxWithToken = fdxService(token)
    const scores = await fdxWithToken.getAccounts().then(fdxWithToken.getTransactionsFromAccounts).then(transactions => averageTransactions(transactions, oneYearAgo.toISOString()))
    ctx.body = scores
}).get('/rewards', cookieMiddleware, async (ctx) => {
    const token = getToken(ctx)
    const rewards = await fdxService(token).getRewards().then(rewards => rewards.rewardPrograms.map(({ programName, programUrl }) => ({ programName, programUrl })))
    ctx.body = rewards
}).get('/auth', async (ctx) => { //on load, client calls this.  If not logged in, redirect to FDX login

    const { code } = ctx.request.query

    // auto generate random bank to log into due to limitation of FDX sandbox.  
    // This is of course quite different from a real implementaiton
    // which would have a unique url per bank.
    const bank = BANK_NAMES[Math.floor(Math.random() * BANK_NAMES.length)];
    if (code) {
        const { accessToken, refreshToken } = await auth.auth(code as string)
        ctx.status = 200;
        setCookies(ctx, bank, accessToken, refreshToken)
    }
    else {
        ctx.status = 401
    }

})

app.use(async (ctx) => {
    const root = path.resolve('../build')
    if (path.extname(ctx.path) === "") {
        await send(ctx, "/", { root, index: "index.html" });
    }
    else {
        await send(ctx, ctx.path, { root, index: "index.html" });
    }
})

app.listen(PORT);