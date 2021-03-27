import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import bcrypt from 'bcrypt';


class UserController {
    constructor() { }

    static async CreateUser(name: any, email: any, phoneNumber: any, password: any, address: any, emergencyContacts: any) {
        const user = await UserModel.findOne({email}).lean().exec();
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

        newUser.password = pass
        const saved = await newUser.save();

        return {
            "msg": "User created"
        };
    }

    static async Login(email: any, password: any) {
        const user = await UserModel.findOne({
            email
        }).lean.exec();

        if (user === null) {
            return {
                error: 'Wrong email or password'
            }
        } else {
            // Compare hash 
            const compare = await bcrypt.compare(password, user.password);

            if (compare) {
                //   TODO: Implement jwt
                const payload = {
                    name: user.name,
                    email: user.email
                };

                const token = jwt.sign(payload, 'abcd');
                return {
                    token
                };
            } else {
                return {
                    msg: 'Wrong email or Password'
                }
            }
        }
    }
}

export default UserController;