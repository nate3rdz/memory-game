import {Request, Response} from 'express';
import InternalAPIError from "../../classes/InternalAPIError.js";
import {retrieveRankingsByUser, updateUserTiming} from "../../services/rankings.service.js";
import Match from "../../models/match.model.js";
import User from "../../models/user.model.js";

/**
 * Atomically updates user timing - The atomicity is needed in order to give a fully synchronized ranking table, to handle the case in which I'm watching the ranking in the same moment that it's under update, and so I'm watching a wrong ranking.
 * @param req Request's object
 * @param res Response's object
 */
export async function updateUserBestTiming(req: Request, res: Response) {
    try {
        const match = await Match.findById(req.body._id);
        if(!match) throw new InternalAPIError('Match not found', 404);
        if(!match.closed) throw new InternalAPIError('The selected match is not closed yet.', 409);

        // atomically updates user's timing
        await updateUserTiming(match); // No result collecting is needed, since if something goes bad, it returns an error that will be handled by the controller's catch.

        res.status(200).send("OK");
    } catch (e) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}

export async function getUserRanking(req: Request, res: Response) {
    try {
        // This operation might be refactored. With millions of users it can be a heavy-weight for the servers.

        // Retrieve a raw rank list
        const rankings = (await retrieveRankingsByUser(req.params.id))[0];
        const size = rankings.target.length+rankings.lower.length+rankings.greater.length;
        const midSize = rankings.target.length+rankings.lower.length;

        let tmpCounter = 0;
        const result = [];

        for(let i = 1; i <= size; i++) {
            if(i <= rankings.lower.length) { // I'm still editing the lower
                if(i > rankings.lower.length-3){
                    rankings.lower[i-1].rank = i;
                    result.push(rankings.lower[i-1]);
                } // I'll keep track only of the ranks of the 3 players on the top of the target, of the target and of the 3 players on the bottom!
            } else if(i >= rankings.lower.length && i <= midSize) {
                rankings.target[0].rank = i;
                result.push(rankings.target[0]);
            }
            else {
                if(i <= midSize+3) {
                    rankings.greater[tmpCounter].rank = i;
                    result.push(rankings.greater[tmpCounter]);
                    tmpCounter++;
                }
            }
        }

        return res.status(200).send(result);
    } catch (e) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}




// Ogni qual volta finisce un match vi è il ricalcolo delle classifiche
// Algoritmo di ricalcolo:
/**
 * 1) Trovo il punto in cui infilare il nuovo record - e.g. ho un record da infilare fra il rank 4 ed il rank 5, perciò questo diventerà il nuovo rank 5
 * 2) Quelli sotto il rank 5 dovranno essere tutti quanti de incrementati di 1
 *
 */
