import express from 'express';
import {create, del, get, list, patch} from "./match.controller.js";
import {VALIDATION_TARGET, Validator} from "../../middlewares/validation.middleware.js";
import {
    editValidator, postValidator,
    searchFilterValidator,
} from "../../validators/match.validator.js";
import {searchByIdValidator} from "../../validators/common.validator.js";

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

/**
 * @openapi
 * /match:
 *   post:
 *     summary: Creates a new match (that is still opened) in the system
 *     tags:
 *       - Match
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The _id of the user (on the database) that is starting the match
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
 *         description: The user has another match opened and can't create another one
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 *       200:
 *         description: Success
 */
matchRouter.post(routes.post, new Validator(postValidator, VALIDATION_TARGET.BODY).validate(), create);

/**
 * @openapi
 * /match/:id:
 *   patch:
 *     summary: Edits the record of a match in the system
 *     tags:
 *       - Match
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: parameters
 *         name: id
 *         description: The id of the match
 *         schema:
 *           type: string
 *           additionalProperties: false
 *           example: 64237d2bfdd16e94125245a3
 *         style: form
 *         explode: true
 *       - in: body
 *         name: closedAt
 *         description: The date of closure of the match, in milliseconds since UNIX (epoch)
 *         schema:
 *           type: number
 *           additionalProperties: false
 *           example: 1680129470000
 *         style: form
 *         explode: true
 *     responses:
 *       500:
 *         description: Unknown server error
 *       409:
 *         description: Match already closed
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad request
 *       200:
 *         description: Success
 */
matchRouter.patch(routes.patch, new Validator(editValidator, VALIDATION_TARGET.BODY).validate(), new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), patch);

/**
 * @openapi
 * /match:
 *   get:
 *     summary: Gets all the match registered on the system
 *     tags:
 *       - Match
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
 *                          description: id of the match on the database
 *                          required: true
 *                          example: 64237d2bfdd16e94125245a3
 *                      user:
 *                          type: string
 *                          description: id of the user associated with this match
 *                          required: true
 *                          example: 64237d31fdd16e94125245a7
 *                      closed:
 *                          type: boolean
 *                          description: If the match is finished or not
 *                          required: true
 *                          example: true
 *                      createdAt:
 *                          type: string
 *                          description: The date (with timing) in which the match has been opened
 *                          required: true
 *                          example: 2023-03-28T23:50:09.812+00:00
 *                      closedAt:
 *                          type: string
 *                          description: The date (with timing) in which the match has been closed
 *                          required: false
 *                          example: 2023-03-28T23:50:49.000+00:00
 */
matchRouter.get(routes.list, new Validator(searchFilterValidator, VALIDATION_TARGET.QUERY).validate(), list);

/**
 * @openapi
 * /match/:id:
 *   get:
 *     summary: Gets a match registered on the system, given its id
 *     tags:
 *       - Match
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: parameters
 *         name: id
 *         description: The id of the match
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
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                    _id:
 *                        type: string
 *                        description: id of the match on the database
 *                        required: true
 *                        example: 64237d2bfdd16e94125245a3
 *                    user:
 *                        type: string
 *                        description: id of the user associated with this match
 *                        required: true
 *                        example: 64237d31fdd16e94125245a7
 *                    closed:
 *                        type: boolean
 *                        description: If the match is finished or not
 *                        required: true
 *                        example: true
 *                    createdAt:
 *                        type: string
 *                        description: The date (with timing) in which the match has been opened
 *                        required: true
 *                        example: 2023-03-28T23:50:09.812+00:00
 *                    closedAt:
 *                        type: string
 *                        description: The date (with timing) in which the match has been closed
 *                        required: false
 *                        example: 2023-03-28T23:50:49.000+00:00
 */
matchRouter.get(routes.get, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), get);

/**
 * @openapi
 * /match/:id:
 *   delete:
 *     summary: Deletes a match of the system (given its id)
 *     tags:
 *       - Match
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: parameters
 *         name: id
 *         description: The id of the match
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
matchRouter.delete(routes.delete, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), del);

export default matchRouter;
