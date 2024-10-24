export const errorMiddleware = (err, res, next) => {
    if (err) {
        res.status(err.code ?? 500).json({error: err.message ?? 'Internal server error'});
    }else{
        next();
    }
};
