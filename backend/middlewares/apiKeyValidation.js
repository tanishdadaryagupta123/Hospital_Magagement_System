import ErrorHandler from "./error.js";
import dotenv from 'dotenv';
dotenv.config();

export const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const expectedApiKey = process.env.API_KEY;

    console.log('Received API Key:', apiKey);
    console.log('Expected API Key:', expectedApiKey);

    if (!apiKey || apiKey !== expectedApiKey) {
        return next(new ErrorHandler("Invalid or missing API key!", 403));
    }

    next();
};


