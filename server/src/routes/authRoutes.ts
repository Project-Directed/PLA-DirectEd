import express, {Response} from 'express'
import { signUp, login, logout } from '../controllers/AuthControllers'
import { Schemas, ValidatorSchema } from '../middlewares/Validator'
import {authenticateToken, AuthRequested} from '../middlewares/authToken'

//add validator middleware

const router = express.Router()

router.post('/signup', ValidatorSchema(Schemas.user.signup),signUp)
router.post('/login', ValidatorSchema(Schemas.user.login),login)
router.get('/me', authenticateToken, (req:AuthRequested, res:Response)=>{
    res.json(req.user)
})
router.post('/logout', logout)

export = router