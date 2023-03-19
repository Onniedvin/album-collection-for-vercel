let { Album } = require("../models/Album");
let asyncWrapper = require("../middleware/asyncErrors");
const { StatusCodes } = require("http-status-codes");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const getAlbums = asyncWrapper(async (req, res) => {
    const { sort, numericFilters, title, artist } = req.query;
    const queryObject = {};

    if (title) {
        queryObject.title = { $regex: title, $options: "i" };
    }
    if (artist) {
        queryObject.artist = { $regex: artist, $options: "i" };
    }

    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
        };

        const regEx = /\b(<|>|>=|=|<=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        const options = ["year"];

        filters.split(",").forEach((item) => {
            const [field, operator, value] = item.split("-");
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
            }
        });
    }

    let result = Album.find(queryObject);

    if (sort) {
        const sortList = sort.split(",").join(" ");
        result = result.sort(sortList);
    } else {
        result = result.sort("title");
    }

    const albums = await result;

    return res.status(StatusCodes.OK).json(albums);
});

const getAlbum = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const singleAlbum = await Album.findById(id);

    if (!singleAlbum) {
        throw new NotFoundError("Album not found");
    }

    return res.status(StatusCodes.OK).json(singleAlbum);
});

const createAlbum = asyncWrapper(async (req, res, next) => {
    Album.validate(req.body).catch((error) => next(new BadRequestError(error.message)));
    const record = await Album.create(req.body);
    return res.status(StatusCodes.CREATED).json({ success: true, msg: record });
});

const updateAlbum = asyncWrapper(async (req, res, next) => {
    const result = await Album.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }).catch((error) => next(new BadRequestError(error.message)));
    if (!result) throw new NotFoundError("Could not find album with id " + req.params.id);
    return res.status(StatusCodes.OK).json({ success: true });
});

const deleteAlbum = asyncWrapper(async (req, res) => {
    if (!(await Album.findById(req.params.id))) throw new NotFoundError("Could not find album with id " + req.params.id);
    await Album.findByIdAndDelete(req.params.id);
    return res.status(StatusCodes.OK).json({ success: true });
});

module.exports = {
    getAlbums,
    getAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
};
