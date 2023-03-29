import express from 'express';
import {VALIDATION_TARGET, Validator} from "../../middlewares/validation.middleware.js";
import {searchByIdValidator, paginationValidator} from '../../validators/common.validator.js';
import {getGlobalRankings, getUserRanking} from "./rankings.controller.js";

export const routes = {
    root: '/rankings',

    globalRankings: '',
    userRanking: '/:id([a-zA-Z0-9]+)'
};

const rankingsRouter = express.Router();

/**
 * @openapi
 * /rankings/:id:
 *   get:
 *     summary: Gets the ranking of a user, with the 3 players immediately ahead of the player and 3 players immediately behind the player. The players are sorted by rank (so, by bestTiming), by date of start of the match (if two players have the same bestTiming) and by a lexicographical sorting
 *     tags:
 *       - Rankings
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
 *                          required: true
 *                          example: 11.560
 *                      rank:
 *                          type: number
 *                          description: The position, expressed in a positive integer number, of the player in the rankings
 *                          required: true
 *                          example: 27
 */
rankingsRouter.get(routes.userRanking, new Validator(searchByIdValidator, VALIDATION_TARGET.PARAMS).validate(), getUserRanking);

/**
 * @openapi
 * /rankings:
 *   get:
 *     summary: Gets a paginated version of the full rankings; The players are sorted by rank (so, by bestTiming), by date of start of the match (if two players have the same bestTiming) and by a lexicographical sorting
 *     tags:
 *       - Rankings
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: skip
 *         description: The number of records to skip (e.g. 50*page_of_rankings)
 *         schema:
 *           type: number
 *           additionalProperties: false
 *           example: 50
 *         style: form
 *         explode: true
 *       - in: query
 *         name: limit
 *         description: Maximum number of users to retrieve in this call (e.g. 50, so you'll get 50 users per page)
 *         schema:
 *           type: number
 *           additionalProperties: false
 *           example: 50
 *         style: form
 *         explode: true
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
 *                          required: true
 *                          example: 11.560
 *                      rank:
 *                          type: number
 *                          description: The position, expressed in a positive integer number, of the player in the rankings
 *                          required: true
 *                          example: 27
 */
rankingsRouter.get(routes.globalRankings, new Validator(paginationValidator, VALIDATION_TARGET.QUERY).validate(), getGlobalRankings);

export default rankingsRouter;
