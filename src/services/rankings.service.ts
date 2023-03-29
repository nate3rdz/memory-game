import User from "../models/user.model.js";
import {ObjectId} from 'mongodb';

/**
 * Dato l'id di un utente, questa funzione ritorna l'utente stesso ed un array di utenti al di sopra e al di sotto nella classifica. Gli array sono ordinati in ordine crescente (rispetto a bestTiming), perciò rappresentano la classifica vera e propria.
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
            '$sort': { // lets sort the documents by the lowest to the highest bestTiming, for the bestMatchDate (who started the match first has priority) and through a lexicographical sorting of the nickname
                'users.bestTiming': 1,
                'users.bestMatchDate': 1,
                'users.nickname': 1
            }
        }, {
            '$match': {
                'users.bestTiming': {
                    '$lte': Number(process.env.MAX_RANKING_TIMING) // If the bestTiming of the user is not < MIN_RANKING_TIMING, the user won't be ranked at all
                }
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
                                '_id': '$users._id',
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
                                '_id': '$users._id',
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
                                '_id': '$users._id',
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

export async function retrieveGlobalRankings(skip: number = 0, limit: number = 50) {
    return User.find({bestTiming: {$lte: Number(process.env.MAX_RANKING_TIMING)}}).sort({bestTiming: 1}).skip(skip).limit(limit);
}