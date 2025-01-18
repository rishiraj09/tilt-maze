import { Schema, Document, Model, model} from "mongoose";

export interface UserDocument extends Document {
    name: string;
    email:string;
    encrypted_password: string;
    reset_token: string;
    reset_token_expiration: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema: Schema<UserDocument> = new Schema({
    name: {
        type:String,
        minlength:[2, "Name should be minimum of 2 characters"],
        maxlength:[80, "Name should be maximum of 80 characters"],
        trim: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    encrypted_password:{
        type:String,
        required:[true, "Provide password"],
        select: false
    },
    reset_token:{
        type:String,
        trim: true,
        default: null
    },
    reset_token_expiration:{
        type: Date,
        default: null
    },
},{timestamps:true})

const User: Model<UserDocument> = model<UserDocument>('User', userSchema);
export default User;
