const { StatusCodes } = require("http-status-codes");
const APIError = require("../errors/APIError");

const errorHandler = (err, _req, res, _next) => {
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    } else return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "There was an error, please try again in a few minutes" });
};

module.exports = errorHandler;
