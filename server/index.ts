import Koa from "koa";
import serve from "koa-static";
import Router from '@koa/router'

const router = new Router();
const app = new Koa();
app.use(serve("../build/"));
app.use(router.routes()).use(router.allowedMethods());
router.post('/scores', (ctx, next) => {
    //todo, implement "calculation" of scores here.  Potentially won't need this
    ctx.body = 'Hello World!';
}).get('/scores', (ctx, next) => {
    //todo, implement the retrieval of scores for consumption by UI
    ctx.body = 'Hello World!';
});


app.listen(3000);