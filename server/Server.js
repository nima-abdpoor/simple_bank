const koa = require("koa")
const KoaRouter = require("koa-router")
const parser = require("koa-bodyparser")
const Middlewares = require("../middlewares/middlewareConfig");

// const cookieParser = require("cookie-parser");

const server = new koa()
const router = KoaRouter()

//middleware

function startServer(){
    server.use(parser())
    server.use(Middlewares)
    server.use(router.routes())
    server.listen(process.env.PORT, process.env.ADDRESS, () => {
        console.log("Start Listening...")
    })
}

module.exports = {
    startServer,
    router
}