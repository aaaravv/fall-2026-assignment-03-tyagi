import { Router, Request, Response } from 'express';
import {getAllTickets, getTicketById, createTicket, updateTicketStatus} from '../dal/tickets.js';
import {NewTicket } from '../db/database.js';
import {authMiddleware} from '../middleware/auth.js';

const router = Router();

// TODO: Student implementation - Part 1: Ticket Routes
// GET /tickets
router.get('/', async(req: Request, res: Response) => {
    try{
        let limit = req.query.limit ? Number(req.query.limit): 10;
        let offset = req.query.offset ? Number(req.query.offset): 0;
        let status = req.query.status ? String(req.query.status): 'TODO';

        let allTix = await getAllTickets();
        let validTix = allTix.filter(tic => tic.status == status);


        let pagedValidTix =validTix.slice(offset, offset + limit);

        return res.status(200).json(pagedValidTix);
    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'});
    }
});
// GET /tickets/:id
router.get('/:id', async(req: Request, res: Response) => {
    try{
        let id = Number(req.params.id);
        let tic = await getTicketById(id);

        if(!tic){
            return res.status(404).json({error: 'Not found'})
        }

        return res.status(200).json(tic);

    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

// POST /tickets
router.post('/', authMiddleware, (req: Request, res: Response) => {
    try{
        let creator_id = Number(res.locals.userId);
        let title = String(req.body);

        let newTic: NewTicket = {title, creator_id};

        createTicket(newTic);
        return res.status(200).json('Ok')
    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'});
    }
});
// PATCH /tickets/:id/status
router.patch('/:id/status', (req: Request, res:Response) => {
    try{
        let ticId = Number(req.params.id);
        let status = String(req.body.status);

        updateTicketStatus(ticId, status)
        return res.status(200).json('Ok')
    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

// TODO: Student implementation - Part 2: Time Log Routes
// POST /tickets/:id/time
// GET /tickets/:id/time

export default router;
