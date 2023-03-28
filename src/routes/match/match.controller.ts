import {Request, Response} from 'express';
import Match from '../../models/match.model.js';
import InternalAPIError from "../../classes/InternalAPIError.js";
import mongoose, {UpdateWriteOpResult} from "mongoose";
import User from "../../models/user.model.js";

export async function create(req: Request, res: Response) {
    try {
        const userSrc = await User.findById(req.body.user);
        if(!userSrc) throw new InternalAPIError('The selected user does not exist.', 404);

        // TODO: add a cron job at the start of the server and every 6h to check it the user has quitted the session
        const matchOnCourse: any[] = await Match.find({closed: false, user: req.body.user});
        if(matchOnCourse.length > 0) throw new InternalAPIError('You\'re already having a match! stop the last one before creating another one.', 409);

        const match = await Match.create({...req.body, createdAt: Date.now()});

        if(!match) throw new InternalAPIError(`Error while creating the new match on the database`, 500);
        res.status(200).send(match);
    } catch (e: any) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}

export async function list(req: Request, res: Response) {
    try {
        const matches = await Match.find(req.query);
        res.status(200).send(matches);
    } catch (e: any) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}

export async function get(req: Request, res: Response) {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) throw new InternalAPIError('Invalid match id', 400);

        const match = await Match.findById(req.params.id);
        if(!match) throw new InternalAPIError('Match not found', 404);

        res.status(200).send(match);
    } catch (e: any) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}

export async function patch(req: Request, res: Response) {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) throw new InternalAPIError('Invalid match id', 400);

        const match: UpdateWriteOpResult = await Match.updateOne({_id: req.params.id}, {$set: req.body});
        if(match.matchedCount < 1) throw new InternalAPIError('Match not found', 404);

        res.status((match.modifiedCount > 0) ? 200 : 304).send("Acknowledged");
    } catch (e) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}

export async function del(req: Request, res: Response) {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) throw new InternalAPIError('Invalid match id', 400);

        const match = await Match.deleteOne({_id: req.params.id});
        // @ts-ignore
        if(match.deletedCount < 1) throw new InternalAPIError('Match not found', 404);

        res.status(200).send("Acknowledged");
    } catch (e) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}
