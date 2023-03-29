import express from 'express';
import {create, del, get, list, patch} from "./user.controller.js";
import {VALIDATION_TARGET, Validator} from "../../middlewares/validation.middleware.js";
import {
    createValidator,
    searchFilterValidator,
    updateValidator,
} from "../../validators/user.validator.js";
import {searchByIdValidator} from '../../validators/common.validator.js';

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
 * /users:
 *   post:
 *     summary: Creates a new user in the system
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: nickname
 *         description: The name of the user
 *         schema:
 *           type: string
 *           additionalProperties: false
 *           example: Francesco03
 *         style: form
 *         explode: true
 *     responses:
 *       500:
 *         description: Unknown server error
 *       409:
 *         description: User already registered
 *       400:
 *         description: Bad request
 *       200:
 *         description: Success
 */
userRouter.post(routes.post, new Validator(createValidator, VALIDATION_TARGET.BODY).validate(), create);

/**
 * @openapi
 * /users/:id:
 *   patch:
 *     summary: Edits the record of a user in the system
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: parameters
 *         name: id
 *         description: The id of the user
 *         schema:
 *           type: string
 *           additionalProperties: false
 *           example: 64237d2bfdd16e94125245a3
 *         style: form
 *         explode: true
 *       - in: body
 *         name: nickname
 *         description: The new name wanted by the user
 *         schema:
 *           type: string
 *           additionalProperties: false
 *           example: Francesco03
 *         style: form
 *         explode: true
 *     responses:
 *       500:
 *         description: Unknown server error
 *       409:
 *         description: Nickname already taken
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad request
 *       304:
 *         description: User not modified
 *       200:
 *         description: Success
 */
userRouter.patch(routes.patch, new Validator(updateValidator, VALIDATION_TARGET.BODY).validate(), new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), patch);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Gets all the users of the system
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       500:
 *         description: Unknown server error
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                      _id:
 *                          type: string
 *                          description: id of the user on the database
 *                          required: true
 *                          example: 64237d2bfdd16e94125245a3
 *                      nickname:
 *                          type: string
 *                          description: nickname of the user
 *                          required: true
 *                          example: Francesco03
 *                      bestTiming:
 *                          type: number
 *                          description: The best game time obtained by the user
 *                          required: false
 *                          example: 11.560
 *                      bestMatchDate:
 *                          type: string
 *                          description: The date of the last best match of the user
 *                          required: false
 *                          example: 2023-03-28T23:50:09.812+00:00
 */
userRouter.get(routes.list, new Validator(searchFilterValidator, VALIDATION_TARGET.QUERY).validate(), list);

/**
 * @openapi
 * /users/:id:
 *   get:
 *     summary: Gets a user of the system (given his id)
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: parameters
 *         name: id
 *         description: The id of the user
 *         schema:
 *           type: string
 *           additionalProperties: false
 *           example: 64237d2bfdd16e94125245a3
 *         style: form
 *         explode: true
 *     responses:
 *       500:
 *         description: Unknown server error
 *       409:
 *         description: The user is still having another match
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                    _id:
 *                        type: string
 *                        description: id of the user on the database
 *                        required: true
 *                        example: 64237d2bfdd16e94125245a3
 *                    nickname:
 *                        type: string
 *                        description: nickname of the user
 *                        required: true
 *                        example: Francesco03
 *                    bestTiming:
 *                        type: number
 *                        description: The best game time obtained by the user
 *                        required: false
 *                        example: 11.560
 *                    bestMatchDate:
 *                        type: string
 *                        description: The date of the last best match of the user
 *                        required: false
 *                        example: 2023-03-28T23:50:09.812+00:00
 */
userRouter.get(routes.get, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), get);

/**
 * @openapi
 * /users/:id:
 *   delete:
 *     summary: Deletes a user of the system (given his id)
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: parameters
 *         name: id
 *         description: The id of the user
 *         schema:
 *           type: string
 *           additionalProperties: false
 *           example: 64237d2bfdd16e94125245a3
 *         style: form
 *         explode: true
 *     responses:
 *       500:
 *         description: Unknown server error
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad request
 *       200:
 *         description: Success
 */
userRouter.delete(routes.delete, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), del);

export default userRouter;
