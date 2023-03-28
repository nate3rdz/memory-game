import IMatch from "../interfaces/IMatch";
import User from "../models/user.model.js";
import mongoose from 'mongoose';
import InternalAPIError from "../classes/InternalAPIError.js";
import {ObjectId} from 'mongodb';

/**
 * This function, given a new match, atomically updates the user timing
 * @param newMatch
 */
export async function updateUserTiming(newMatch: IMatch) {
    // No try-n-catch here; if an error will be thrown to the upper level (e.g. controller), it will handle it
    // Lets start a transaction - the transaction will acquire a lock over the collection, avoiding parallelism and concurrency over the records from several instances of the server
    let session: any = null;
    return mongoose.startSession().then(_session => {
        session = _session; // lets save session variable to close it later

        return session.withTransaction(() => {
            return User.findById(newMatch.user).then(user => {
                if(!user) throw new InternalAPIError('Error while updating rankings, user not found', 404);
                if(!user?.bestTiming) user.bestTiming = null;

                let newTiming = (newMatch.closedAt - newMatch.createdAt)/1000; // compute the game time performed by the user
                if(newTiming > user?.bestTiming && user?.bestTiming) newTiming = user.bestTiming; // if the best time performed by the user is still lower than the new one, lets keep it in the cache

                return User.updateOne({_id: user._id}, {$set: {bestTiming: newTiming}}).then(result => { // updates the user and checks if the update is OK
                    if(result.modifiedCount < 1 || result.matchedCount < 1) throw new InternalAPIError('Error while updating rankings', 500);
                })
            })
        })
    }).then(() => { // lets commit and close the transaction to apply the updates and release the lock
        session.commitTransaction().then(() => {
            session.endSession().then(() => {return true;});
        })
    });

    // No false return needed, since if something goes bad, an error is thrown.
}

/**
 * Dato l'id di un utente, questa funzione ritorna l'utente stesso ed un array di utenti al di sopra e al di sotto nella classifica. Gli array sono ordinati per idx, perciò rappresentano la classifica vera e propria.
 * Leggere tutta la classifica e individuare l'utente, a questo punto, è al più un O(n) dove n sono gli utenti.
 * @param user
 */
export async function retrieveRankingsByUser(user: string): Promise<any> {
    return User.aggregate([
        {
            '$match': { // lets search the record of the user
                '_id': new ObjectId(user)
            }
        }, { // lets clone the rest of the collection in order to manipulate it
            '$lookup': {
                'from': 'users',
                'pipeline': [],
                'as': 'users'
            }
        }, {
            '$unwind': { // lets "open" the array in order to do operations over the objects inside of it
                'path': '$users',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$sort': { // lets sort the documents by the lowest to the highest bestTiming
                'users.bestTiming': 1
            }
        }, {
            '$group': { // lets group the users in respect to the selected user
                '_id': null,
                'lower': {
                    '$push': {
                        '$cond': {
                            'if': {
                                '$lte': [
                                    '$bestTiming', '$users.bestTiming'
                                ]
                            },
                            'then': '$$REMOVE',
                            'else': {
                                '_id': '$_id',
                                'nickname': '$users.nickname',
                                'bestTiming': '$users.bestTiming'
                            }
                        }
                    }
                },
                'target': {
                    '$push': {
                        '$cond': {
                            'if': {
                                '$eq': [
                                    '$nickname', '$users.nickname'
                                ]
                            },
                            'then': {
                                '_id': '$_id',
                                'nickname': '$users.nickname',
                                'bestTiming': '$users.bestTiming'
                            },
                            'else': '$$REMOVE'
                        }
                    }
                },
                'greater': {
                    '$push': {
                        '$cond': {
                            'if': {
                                '$gte': [
                                    '$bestTiming', '$users.bestTiming'
                                ]
                            },
                            'then': '$$REMOVE',
                            'else': {
                                '_id': '$_id',
                                'nickname': '$users.nickname',
                                'bestTiming': '$users.bestTiming'
                            }
                        }
                    }
                }
            }
        }
    ])
}