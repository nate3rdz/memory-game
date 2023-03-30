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

        const result: any[][] = [[], []];
        let lastRankBeforeTarget = 0;

        for(let i = 0; i < 3; i++) {
            if(rankings.lower.length > 0) {
                if(rankings.lower[(rankings.lower.length-1)-i]) {
                    result[0].unshift({
                        ...rankings.lower[(rankings.lower.length-1)-i],
                        rank: rankings.lower.length-i
                    });
                    lastRankBeforeTarget = (lastRankBeforeTarget > rankings.lower.length-i) ? lastRankBeforeTarget : rankings.lower.length-i;
                } // se posso leggere qualcosa da lower..
            }
            if(rankings.greater.length > 0) {
                if(!rankings.greater[i]) continue;

                result[1].push({
                    ...rankings.greater[i],
                    rank: rankings.lower.length+(i+1)+1
                })
            }
        }

        result[0].push({
            ...rankings.target[0],
            rank: lastRankBeforeTarget+1
        });
        result[0].push(...result[1]);

        // The selected user will be the element at the pos. Math.floor(result.length/2)+1 (in the middle!)
        return res.status(200).send(result[0]);
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