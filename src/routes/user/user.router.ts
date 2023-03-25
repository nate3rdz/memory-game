import express from 'express';
import {create, del, get, list, patch} from "./user.controller.js";
import {VALIDATION_TARGET, Validator} from "../../middlewares/validation.middleware.js";
import {searchByIdValidator, searchFilterValidator, validator} from "../../validators/user.validator.js";

export const routes = {
    root: '/user',

    list: '/',
    post: '/',
    get: '/:id([a-zA-Z0-9]+)',
    delete: '/:id([a-zA-Z0-9]+)',
    patch: '/:id([a-zA-Z0-9]+)'
};

const userRouter = express.Router();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Get schedules basing on a filter
 *     tags:
 *       - Requester / Mailer
 *       - Scheduler
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: params
 *         description: The filter passed to the endpoint (the filter will match data inside of the request body of the requests saved inside of the DB)
 *         schema:
 *           type: object
 *           additionalProperties: true
 *         style: form
 *         explode: true
 *     responses:
 *       500:
 *         description: Unknown server error
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Unknown server error
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CompleteScheduleResult"
 */
userRouter.post(routes.post, new Validator(validator, VALIDATION_TARGET.BODY).validate(), create);

userRouter.patch(routes.patch, new Validator(validator, VALIDATION_TARGET.BODY).validate(), new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), patch);

userRouter.get(routes.list, new Validator(searchFilterValidator, VALIDATION_TARGET.QUERY).validate(), list);
userRouter.get(routes.get, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), get);

userRouter.delete(routes.delete, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), del);

export default userRouter;
