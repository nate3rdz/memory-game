import express from 'express';
import {create, del, get, list, patch} from "./match.controller.js";
import {VALIDATION_TARGET, Validator} from "../../middlewares/validation.middleware.js";
import {
    editValidator,
    searchByIdValidator,
    searchFilterValidator,
    validator
} from "../../validators/match.validator.js";

export const routes = {
    root: '/match',

    list: '/',
    post: '/',
    get: '/:id([a-zA-Z0-9]+)',
    delete: '/:id([a-zA-Z0-9]+)',
    patch: '/:id([a-zA-Z0-9]+)',

    gameRanking: '/rankings'
};

const matchRouter = express.Router();

matchRouter.post(routes.post, new Validator(validator, VALIDATION_TARGET.BODY).validate(), create);

matchRouter.patch(routes.patch, new Validator(editValidator, VALIDATION_TARGET.BODY).validate(), new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), patch);

matchRouter.get(routes.list, new Validator(searchFilterValidator, VALIDATION_TARGET.QUERY).validate(), list);
matchRouter.get(routes.get, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), get);

matchRouter.delete(routes.delete, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), del);

export default matchRouter;
