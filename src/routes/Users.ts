import StatusCodes, { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import userController from '../controllers/user.controller';
import UserDao from '@daos/User/UserDao.mock';
import { paramMissingError, IRequest } from '@shared/constants';
import { STATUS_CODES } from 'node:http';
import UserController from '../controllers/user.controller';

const router = Router();
const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

// Create New User
router.post('/create', async (req, res) => {
    try {
        console.log(req.body.contacts)
        const result = await userController.CreateUser(req.body.name, req.body.email,
            req.body.phone, req.body.password, req.body.address, req.body.contacts);
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post('/login', async (req, res) => {
    try {
        const result = await userController.Login(req.body.email, req.body.password);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.post('/update', async (req, res) => {
    try {
        const result = await userController.UpdateUser(req.body.update, req.body.email);
        res.json({ "msg": "updated" });
    } catch (error) {
        res.json(error);
    }
});

router.post('/addContacts', async (req, res) => {
    try {
        UserController.addUserContacts(req.body.contacts, req.body.email);
        res.sendStatus(OK)
    } catch (error) {
        res.sendStatus(INTERNAL_SERVER_ERROR);
    }
})

router.get('/contacts/:email', async (req, res) => {
    try {
        const result = await UserController.GetContacts(req.params.email);
        res.json(result);
    } catch (error) {
        res.sendStatus(INTERNAL_SERVER_ERROR);
    }
})



/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', async (req: IRequest, res: Response) => {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    await userDao.add(user);
    return res.status(CREATED).end();
});



/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: IRequest, res: Response) => {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    user.id = Number(user.id);
    await userDao.update(user);
    return res.status(OK).end();
});



/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: IRequest, res: Response) => {
    const { id } = req.params;
    await userDao.delete(Number(id));
    return res.status(OK).end();
});



/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
