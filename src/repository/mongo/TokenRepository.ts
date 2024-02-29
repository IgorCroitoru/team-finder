import { ITokenRepository } from "../../shared/interfaces/repository/token.rep.interface";
import { IToken } from "../../shared/interfaces/token.interface";
import { TokenModel } from "../../models/token.model";
export class TokenRepository implements ITokenRepository{
    async findOneByUserId(id: any): Promise<IToken | null> {
        const doc = await TokenModel.findOne({userId:id})
        if(!doc){
            return null
        }
        return doc.toObject({ versionKey: false }) as IToken;
    }
    async create(item: IToken): Promise<IToken> {
        const doc = await TokenModel.create(item);
        return doc.toObject({ versionKey: false }) as IToken;
    }
    async findById(id: any): Promise<IToken | null> {
        const doc = await TokenModel.findById(id).exec();
        if(!doc){
            return null 
        }
        return doc.toObject({ versionKey: false })as IToken;
    }
    async findOne(query: Partial<IToken> & { [key: string]: any }): Promise<IToken | null> {
        return await TokenModel.findOne(query).exec();
    }
}