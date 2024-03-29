import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
    res.json({
        message: 'Server route is working!',
    });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
       return next(errorHandler(401, 'You can only update your own account!'));
    
    try {
        if( req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        
        console.log(req.user.userFirstName);
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    userFirstName: req.body.userFirstName || req.user.userFirstName,
                    userLastName: req.body.userLastName || req.user.userLastName,
                    phoneNumber: req.body.phoneNumber || req.user.phoneNumber,
                    email: req.body.email || req.user.phoneNumber,
                    dateOfBirth: req.body.dateOfBirth || req.user.dateOfBirth,
                    password: req.body.password || req.user.password,
                    preferences: req.body.preferences || req.user.preferences,
                    avatar: req.body.avatar || req.user.avatar,
                },
            },
            { new: true }
        );
        
        // updateUser = await User.findOne({_id: req.params.id});
        // console.log(updatedUser);

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};



export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id)
        return next(errorHandler(401, 'You can only delete your own account!'));

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error);
    }
};


export const getuserListings = async (req, res, next) => {
    if(req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listings'));
    }
};


export const addArticleIdToBlock = async (req, res, next) => {
    try {
        const { listingId, userId } = req.body;

        const user = await User.findById(userId);
        if( !user){
            return next(errorHandler(404, 'User not found!'));
        }
        const listing = await Listing.findById(listingId);
        if( !listing ) {
            return next(errorHandler(404, "User not found"));
        } 

        if(!user.blockArticle.includes(listingId)){
            user.blockArticle.push(listingId);
            await user.save();
            res.status(200).json({message:'Listing blocked successfully!'});
        }else {
            res.status(200).json({ message: 'Listing is already blocked!' });
          } 
    } catch (error) {
        next(error);
    }
};


