import express from 'express';
import {VALIDATION_TARGET, Validator} from "../../middlewares/validation.middleware.js";
import {
    searchByIdValidator,
    updateTimingValidator
} from "../../validators/rankings.validator.js";
import {getUserRanking, updateUserBestTiming} from "./rankings.controller.js";

export const routes = {
    root: '/rankings',

    timing: '/timing',
    userRanking: '/:id([a-zA-Z0-9]+)'
};

const rankingsRouter = express.Router();

rankingsRouter.patch(routes.timing, new Validator(updateTimingValidator, VALIDATION_TARGET.BODY).validate(), updateUserBestTiming);
rankingsRouter.get(routes.userRanking, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), getUserRanking);

export default rankingsRouter;
