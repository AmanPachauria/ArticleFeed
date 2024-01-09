import express from 'express';
import { deleteUser, getuserListings, test, updateUser, addArticleIdToBlock } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser );
router.get('/listings/:id', verifyToken, getuserListings);
router.post('/blockArticle', addArticleIdToBlock)

export default router;