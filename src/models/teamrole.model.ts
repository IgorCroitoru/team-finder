import mongoose, {Schema, Document} from 'mongoose'
import { ITeamRole } from '../shared/interfaces/teamrole.interface'

interface IDocTeamRole extends ITeamRole, Document {}

const teamRoleSchema = new Schema<IDocTeamRole>({
    name: {type: String, required: true, index: true},
    organizationId: {type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true}
})

export const TeamRole = mongoose.model<IDocTeamRole>('TeamRole', teamRoleSchema)