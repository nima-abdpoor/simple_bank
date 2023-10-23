async function interceptor(ctx, next) {
    console.log("interceptor <--" + ctx.path)
    console.log("interceptor <--" + ctx.request.rawBody)
    await next()
    let originalBody = ctx.body;
    console.log("interceptor -->" + ctx.status)
    if (typeof ctx.body === 'string' && ctx.response.is('json')) {
        ctx.body = JSON.parse(ctx.body);
    }
    console.log('Raw Response Body:', ctx.body);
    ctx.body = originalBody;
}

module.exports = {
    interceptor
}