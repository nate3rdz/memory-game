import express from 'express';
import {VALIDATION_TARGET, Validator} from "../../middlewares/validation.middleware.js";
import {
    paginationValidator,
    searchByIdValidator,
    updateTimingValidator
} from "../../validators/rankings.validator.js";
import {getGlobalRankings, getUserRanking} from "./rankings.controller.js";

export const routes = {
    root: '/rankings',

    globalRankings: '',
    userRanking: '/:id([a-zA-Z0-9]+)'
};

const rankingsRouter = express.Router();

rankingsRouter.get(routes.userRanking, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), getUserRanking);
rankingsRouter.get(routes.globalRankings, new Validator(paginationValidator, VALIDATION_TARGET.QUERY).validate(), getGlobalRankings);

export default rankingsRouter;
