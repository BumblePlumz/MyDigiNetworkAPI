import { config as configDotenv } from 'dotenv';

configDotenv();

export const errorMiddleware = (err, req, res, next) => {
    if (err) {
        if (process.env.NODE_ENV === 'development') {
            res.status(err.code ?? 500).json({
                success: false,
                code: err.code ?? 500,
                errors: err.stack ?? [],
                message: err.message ?? 'Internal server error',
            });
        }else{
            res.status(err.code ?? 500).json({
                success: false,
                code: err.code ?? 500,
                message: err.message ?? 'Internal server error',
            });
        }
    }else{
        next();
    }
};
