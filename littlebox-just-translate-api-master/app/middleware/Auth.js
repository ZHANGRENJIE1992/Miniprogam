module.exports = () => {
    return async function handler(ctx, next) {
        await next();
    };
};
