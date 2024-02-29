import { IToken } from "../token.interface";

export interface ITokenRepository extends IGenericRepository<IToken>{
    findOneByUserId(id: any): Promise<IToken | null>
   // findOneByRefreshToken(refreshToken:string): Promise<IToken | null>
    
}