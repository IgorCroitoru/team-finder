import { IUser } from "./user.interface"
export interface IOrganization{
   // _id?: string
    name: string,
    hq_address: string,
    adminsId: string[]
    departmentsId: string[]
    creator: IUser
}