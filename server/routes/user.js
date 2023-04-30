const router = require('express').Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchUser = require('../middleware/fetchUser');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET

router.post('/register', [
    body('name', "Enter a valid name!!").isAlpha('en-IN',{ignore: ' '}),
    body('email', "Enter a valid email!!").isEmail(),
    body('password', "Password length needs to be min 5 characters!!").isLength({min: 5})
], async (req, res)=>{
    console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'failure',
            message: errors.array()
        })
    }
    const {name, email, password, age} = req.body
    try{
        //check if user already exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                status: 'failure',
                message: 'A user already exists with this email!'
            })
        }
        //generating hash
        const hash = await bcrypt.hash(password, 10);
        //creating new user
        user = await User.create({
            name,
            email,
            password: hash,
            age
        })
        return res.status(201).json({
            status: 'success',
            user
        })
    }
    catch(e){
        return res.status(500).json({
            status: 'failure',
            message: e.message
        })
    }
})

router.post('/login',[
    body('email', "Enter a valid email!!").isEmail(),
    body('password', "Password length needs to be min 5 characters!!").isLength({min: 5})
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'failure',
            message: errors.array()
        })
    }
    const {email, password} = req.body
    try{
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                status: 'failure',
                message: "User doesn't exist please signup!!"
            })
        }
        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            return res.status(400).json({
                status: 'failure',
                message: 'Invalid credentials'
            })
        }
        const token = jwt.sign({
            data: user._id
        }, jwtSecret, {
            expiresIn: '1d'
        })
        return res.status(200).json({
            status: "success",
            token,
            role: user.role
        })
    }
    catch(e){
        return res.status(500).json({
            status: 'failure',
            message: e.message
        })
    }
})

router.post('/purchase',fetchUser, async(req, res)=>{
    try {
        let user = await User.findOne({"_id": req.user});
        const {coins, gems} = req.body;
        if(coins){
            if(user.coins < coins){
                return res.status(400).json({
                    status: 'failure',
                    message: 'Not enough coins to make this purchase'
                })
            }
            user = await User.updateOne({'_id': req.user},
            {$inc: {'coins': (coins * (-1))}}
            )
            res.status(200).json({
                status: 'success',
                message: 'Purchase is successfull'
            })
        }else{
            if(user.gems < gems){
                return res.status(400).json({
                    status: 'failure',
                    message: 'Not enough gems to make this purchase'
                })
            }
            user = await User.updateOne({'_id': req.user},
            {$inc: {'gems': (gems * (-1))}}
            )
            res.status(200).json({
                status: 'success',
                message: 'Purchase is successfull'
            })
        }
    }
    catch(e){
        return res.status(500).json({
            status: 'failure',
            message: e.message
        })
    }
})

module.exports = router