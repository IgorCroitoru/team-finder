import mongoose, {Schema} from "mongoose";
import { IOrganization } from "../shared/interfaces/oganization.interface";
interface IOrgDoc extends IOrganization,Document{}
const orgSchema = new Schema<IOrgDoc>({
    name: {type: String, required: true},
    hq_address: {type: String, required: true},
    adminsId: [{type: Schema.Types.ObjectId, ref: 'User', required: true, default: []}],

    //departmentsId: [{type: Schema.Types.ObjectId, ref: 'User', required: true, default: []}]

})