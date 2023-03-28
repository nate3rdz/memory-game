import {Request, Response} from 'express';
import User from '../../models/user.model.js';
import InternalAPIError from "../../classes/InternalAPIError.js";
import mongoose, {UpdateWriteOpResult} from "mongoose";

export async function create(req: Request, res: Response) {
    try {
        const user = await User.create(req.body);

        if(!user) throw new InternalAPIError(`Error while creating the new user on the database`, 500);
        res.status(200).send({_id: user._id});
    } catch (e: any) {
        console.error(e.toString());

        if(e?.code === 11000) return res.status(409).send("User already registered");
        else if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}

export async function list(req: Request, res: Response) {
    try {
        const users = await User.find(req.query);
        res.status(200).send(users);
    } catch (e: any) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}

export async function get(req: Request, res: Response) {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) throw new InternalAPIError('Invalid user id', 400);

        const user = await User.findById(req.params.id);
        if(!user) throw new InternalAPIError('User not found', 404);

        res.status(200).send(user);
    } catch (e: any) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}

export async function patch(req: Request, res: Response) {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) throw new InternalAPIError('Invalid user id', 400);

        const user: UpdateWriteOpResult = await User.updateOne({_id: req.params.id}, {$set: req.body});
        if(user.matchedCount < 1) throw new InternalAPIError('User not found', 404);

        res.status((user.modifiedCount > 0) ? 200 : 304).send("Acknowledged");
    } catch (e) {
        console.error(e.toString());

        if(e?.code === 11000) return res.status(409).send("This nickname has been already taken!");
        else if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}

export async function del(req: Request, res: Response) {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) throw new InternalAPIError('Invalid user id', 400);

        const user = await User.deleteOne({_id: req.params.id});
        // @ts-ignore
        if(user.deletedCount < 1) throw new InternalAPIError('User not found', 404);

        res.status(200).send("Acknowledged");
    } catch (e) {
        console.error(e.toString());

        if(e instanceof InternalAPIError) return res.status(e.status).send(e.message);
        else return res.status(500).send('Internal server error');
    }
}