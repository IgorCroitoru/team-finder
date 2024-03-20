export enum SkillLevel {
    Learns = "Learns",
    Knows = "Knows",
    Does = "Does",
    Helps = "Helps",
    Teaches = "Teaches",
  }
  
  // Define the enum for experience ranges
export enum Experience {
    LESS_THAN_6_MONTHS = "0-6 months",
    SIX_TO_TWELVE_MONTHS = "6-12 months",
    ONE_TO_TWO_YEARS = "1-2 years",
    TWO_TO_FOUR_YEARS = "2-4 years",
    FOUR_TO_SEVEN_YEARS = "4-7 years",
    MORE_THAN_SEVEN_YEARS = ">7 years",
  }

export enum RoleType {
  ADMIN = 1,
  DEPARTMENT_MANAGER = 2,
  PROJECT_MANAGER = 3,
  EMPLOYEE = 4
}

export type RoleString = 'ADMIN' | 'DEPARTMENT_MANAGER' | 'PROJECT_MANAGER' | 'EMPLOYEE';


export const roleNumberToString: Record<RoleType, RoleString> = {
  [RoleType.ADMIN]: 'ADMIN',
  [RoleType.DEPARTMENT_MANAGER]: 'DEPARTMENT_MANAGER',
  [RoleType.PROJECT_MANAGER]: 'PROJECT_MANAGER',
  [RoleType.EMPLOYEE]: 'EMPLOYEE',
};