import Match from "../models/match.model.js";
import mongoose from 'mongoose';
import InternalAPIError from "../classes/InternalAPIError.js";
import User from "../models/user.model.js";

/**
 * This function atomically updates a match; the operation is needed to be atomic since it's possible that users can access the matches (in read mode) and the score of the user that has finished the match
 * @param id
 * @param closedAt
 */
export async function updateMatch(id: string, closedAt: number) {
    let session: any = null;

    return mongoose.startSession().then(_session => { // opens the session and the transaction, putting a lock on the collection
        session = _session;

        return session.withTransaction(() => {
            return Match.findById(id).then(match => {
                if(match.closed) throw new InternalAPIError('Match service error: match already closed, can\'t update it.', 409);
                // No validation on the time needed, since it's already done in the validator

                return Match.updateOne({_id: id}, {$set: {closedAt: new Date(closedAt), closed: true}}).then(res => {
                    if(res.modifiedCount < 1) throw new InternalAPIError('Match service error: exception thrown during match update', 500);

                    return User.findById(match.user).then(user => {
                        if(user.bestTiming > (closedAt - new Date(match.createdAt).getTime())/1000 || !user.bestTiming)
                            return User.updateOne({_id: match.user}, {$set: {bestTiming: (closedAt - new Date(match.createdAt).getTime())/1000, bestMatchDate: match.createdAt}}).then(updateRes => {
                                if(updateRes.modifiedCount < 1) throw new InternalAPIError('Match service error: error while updating user\'s score!', 500);
                            })
                    })
                })
            })
        })
    }).then(() => { // lets commit and close the transaction to apply the updates and release the lock
        session.commitTransaction().then(() => {
            session.endSession().then(() => {return true;});
        })
    });
}