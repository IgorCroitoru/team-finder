import mongoose, {Schema, Document} from "mongoose";
import { IOrganization } from "../shared/interfaces/organization.interface";
interface IOrgDoc extends IOrganization,Document{}
const orgSchema = new Schema<IOrgDoc>({
    name: {type: String, required: true},
    hq_address: {type: String, required: true},
    adminsId: [{type: Schema.Types.ObjectId, ref: 'User', required: true, default: []}],
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: false}
    //departmentsId: [{type: Schema.Types.ObjectId, ref: 'User', required: true, default: []}]
   
},
 { timestamps: true})

 export const Organization = mongoose.model<IOrgDoc>('Organization', orgSchema)