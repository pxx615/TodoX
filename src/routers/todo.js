import express from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { v4 as uuidv4 } from 'uuid';
import { validateTodo, validateUser } from '../schemas/validators.js';
import auth from '../middleware/auth.js';
import { verifyToken } from '../functions/cookies.js';


dayjs.extend(utc);
const router = express.Router();

export default ({ todoRepository }) => {

    // Get todos by userID
    router.get('/', auth, async (req, res) => {
        try {
            let session = verifyToken(req.cookies['todox-session']);
            let resultTodo = await todoRepository.find(session.userID);
            return res.status(201).send(resultTodo);
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({ error: "Todo GET failed." });
        }
    });

    // Create new todo
    router.post('/', auth, async (req, res) => {
        try {
            let session = verifyToken(req.cookies['todox-session']);

            const todoID = uuidv4();
            const created = dayjs().utc().toISOString();

            let newTodo = {
                ...req.body,
                todoID,
                userID: session.userID,
                created,
                status: "notDone"
            };

            if (validateTodo(newTodo)) {
                let resultTodo = await todoRepository.insertOne(newTodo);
                return res.status(201).send(resultTodo);
            }
            console.error(validateTodo.errors);
            return res.status(400).send({error: "Invalid field used."});
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({error: "Todo creation failed."});
        }
    });

    // Delete todo
    router.delete('/', auth, async (req, res) => {
        try {
            if (req.body.todoID) {
                let resultTodo = await todoRepository.deleteOne(req.body.todoID);
                return res.status(201).send(resultTodo);
            }

            return res.status(400).send({ error: "Invalid field used." });
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({ error: "Todo DELETE failed." });
        }
    });

    // Update todo
    router.patch('/', auth, async (req, res) => {
        try {
            if (req.body.todoID && req.body.value) {
                let resultTodo = await todoRepository.updateOne(req.body.todoID, req.body.value);
                return res.status(201).send(resultTodo);
            }

            return res.status(400).send({ error: "Invalid field used." });
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({ error: "Todo UPDATE failed." });
        }
    });
    return router;
}
