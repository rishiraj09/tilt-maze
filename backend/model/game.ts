import { Schema, Document, Model, model} from "mongoose";

export interface GameDocument extends Document {
    user_id: string;
    status: string;
    timer: string | null;
    time_in_second: number | null;
    collision: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const gameSchema: Schema<GameDocument> = new Schema({
    user_id: {
        type:String,
        trim: true,
        required: true
    },
    status:{
        type:String,
        required:true,
        default: "in-progress"
    },
    timer:{
        type: String,
        default: null
    },
    time_in_second:{
        type: Number,
        default: null
    },
    collision: {
        type: Number,
        default: 0
    }
    
},{timestamps:true})

const Game: Model<GameDocument> = model<GameDocument>('Game', gameSchema);
export default Game;
