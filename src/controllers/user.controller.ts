/* tslint:disable */

/* eslint-disable max-len */
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import bcrypt from 'bcrypt';


class UserController {
    constructor() { }

    static async CreateUser(name: any, email: any, phoneNumber: any, password: any, address: any, emergencyContacts: any) {
        const user = await UserModel.findOne({ email }).lean().exec();
        if (user !== null) {
            return {
                "msg": "This user already exists"
            };
        }
        // TODO: Check if user exists already before creating new user
        const newUser = new UserModel({
            name,
            email,
            phoneNumber,
            address,
            emergencyContacts,
        });

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(password, salt);

        //@ts-ignore
        newUser.password = pass
        const saved = await newUser.save();

        return {
            "msg": "User created"
        };
    }

    static async Login(email: string, password: string) {
        try {
            const user = await UserModel.findOne({
                email
            }).exec() as unknown as { name: string, email: string, password: string };

            if (user === null) {
                return {
                    error: 'Wrong email or password'
                }
            } else {
                // Compare hash 
                const compare = await bcrypt.compare(password, user.password);

                if (compare) {
                    //   TODO: Implement jwt
                    return {
                        user
                    };
                } else {
                    return {
                        msg: 'Wrong email or Password'
                    }
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    static async UpdateUser(update: [x: string], email: string) {
        UserModel.findOneAndUpdate({email}, { $set: update}).exec();
    }
}

export default UserController;