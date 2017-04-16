/**
 * Created by rafal on 16/04/2017.
 */
//User Schema
export const UserSchema = {
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
};

export interface UserData{
    name: string,
    email: string,
    username: string,
    password: string
}