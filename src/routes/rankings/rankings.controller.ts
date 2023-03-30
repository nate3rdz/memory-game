import {Request, Response} from 'express';
import InternalAPIError from "../../classes/InternalAPIError.js";
import * as rankingsService from "../../services/rankings.service.js";
import IRankedUser from "../../interfaces/IRankedUser";
import User from "../../models/user.model.js";

export async function getUserRanking(req: Request, res: Response) {
    try {
        // This operation might be refactored. With millions of users it can be a heavy-weight for the servers.

        // First, check if the user is ranked
        const user = await User.findById(req.params.id);
        if(!user) throw new InternalAPIError('This user doesn\'t exist!', 404);
        if(user.bestTiming > Number(process.env.MAX_RANKING_TIMING)) return res.status(200).send("The user is not ranked.");

        // Retrieve a raw rank list
        const rankings = (await rankingsService.retrieveRankingsByUser(req.params.id))[0];
        const size = rankings.target.length+rankings.lower.length+rankings.greater.length;

        const result = [];

        const addedResults: number[] = [0, 0, 0];
        const iterativeIdx: number[] = [0, 0, 0];

        for(let i = 0; i < size; i++) {
            if(rankings.lower.length > 0 && addedResults[0] < 3) { // if the lower array has elements..
                result.push({
                    ...rankings.lower[(rankings.lower.length-1)-3+i],
                    rank: i+1
                });
                addedResults[0]++;
            } else if(rankings.target.length > 0 && addedResults[1] < 1) { // if the target array has elements..
                console.log('caso 2');
                result.push({
                    ...rankings.target[0],
                    rank: i+1
                });
                addedResults[1]++;
            } else if(rankings.greater.length > 0 && addedResults[2] < 3) { // if the greater array has elements..
                console.log('caso 3');
                result.push({
                    ...rankings.greater[(rankings.greater.length-1)+addedResults[2]], // -1 because of the target offset! we "lost" an idx while putting the target
                    rank: i+1
                });
                addedResults[2]++;
            }
        }

        // The selected user will be the element at the pos. Math.floor(result.length/2)+1 (in the middle!)
        return res.status(200).send(result);
    } catch (e) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}

export async function getGlobalRankings(req: Request, res: Response) {
    try {
        const rankings = await rankingsService.retrieveGlobalRankings(Number(req.query.skip), Number(req.query.limit)-1);
        const result: IRankedUser[] = [];

        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 0;

        for(let i = 0; i < rankings.length-skip; i++){
            result.push({
                _id: rankings[i]._id,
                nickname: rankings[i].nickname,
                bestTiming: rankings[i].bestTiming,
                rank: i+skip+1
            });
        }

        res.status(200).send(result);
    } catch (e) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}