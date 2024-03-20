import { INVITATION_LINK_EXPIRATION } from "../../../constants";
import jwt from 'jsonwebtoken'
import { Experience, RoleType, SkillLevel } from "../enums";

/** 
 * @param expiresIn
 * expressed in seconds, EX: 60 = 1m
 *  */
export function generateInvitationToken(inviterId: any, organizationId: any, expiresIn?: number) {
  const payload = { inviterId, organizationId };
  
  const token = jwt.sign(payload, String(process.env.JWT_SIGNUP_SECRET), { expiresIn:expiresIn || INVITATION_LINK_EXPIRATION }); // Token expires in 7 days
  const now = new Date();
  const expirationDate =  expiresIn?new Date(now.getTime()+(expiresIn*1000)):new Date(now.getTime()+(INVITATION_LINK_EXPIRATION*1000))
  return {token, expiration: expirationDate };
}
export function resolveRole(role: number | string): RoleType | undefined {
  if (typeof role === 'number') {
    return Object.values(RoleType).includes(role) ? role : undefined
  } else if (typeof role === 'string') {
    const matchingRole = Object.entries(RoleType).find(([key, val]) => 
      key.toLowerCase() === role.toLowerCase()
    );
    return matchingRole ? RoleType[matchingRole[0] as keyof typeof RoleType] : undefined;
  }
  return;
}
export function parseExperience(input: string | number): Experience | undefined{
  let result = Object.values(Experience).find(value => value === input);
  if (result) return result as Experience;
  return;
}

// Parses and returns a valid SkillLevel enum value or throws an error if invalid
export function parseSkillLevel(input: string): SkillLevel | undefined{
  let result = Object.values(SkillLevel).find(value => value === input);
  if (result) return result as SkillLevel;
  return;
}