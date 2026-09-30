import { Router, Request, Response} from 'express';
import {getAllUsers, getUserById, createUser} from '../dal/users.js';
import {User, NewUser} from '../db/database.js';
import { get } from 'http';


const router = Router();

// TODO: Student implementation - Part 1: User Routes
// GET /users

router.get("/", async (req: Request, res: Response) => {
    try{
        let userList = await getAllUsers();
        return res.status(200).json(userList)
    }catch{
        return res.status(500).json({error: 'Internal Servor Error'});
    }
});

// GET /users/:id
router.get("/:id", async(req: Request, res: Response) => {
    let id = Number(req.params.id);

    let user = await getUserById(Number(id));
    if(!user){
        return res.status(404).json({error: "404 not found"});
    }
    return res.status(200).json(user);
});
// POST /users
router.post("/", async(req: Request, res: Response) => {
    let {name, email} = req.body;

    if(!name || typeof name != "string" || !email || typeof email != "string"){
        return res.status(422).json({error: "Incorrect body"})
    }

    let oser: NewUser = {name, email};
    await createUser(oser);
     return res.status(201).json("201 Created")
});

export default router;
