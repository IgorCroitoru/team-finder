import { generateJWT } from "../shared/utils/jwt.util";
import {UserModel} from "../models/user.model"
export const registerUser = async (email: string, password: string, fingerprint: string) => {
    const user = new UserModel({ email, password });
    await user.save();
  
    const token = generateJWT(user._id.toString(), fingerprint);
    return { user, token };
  };