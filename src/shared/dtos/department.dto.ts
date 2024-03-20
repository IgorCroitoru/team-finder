import {IDepartment} from '../interfaces/department.interface'
import {ISkill} from '../interfaces/skill.interface'
export class DepartmentDto {
    _id? : any
    name: string;
    manager?: string;
    organization: string;
    skills?: ISkill[];
  
    constructor(department: IDepartment, includeSkills: boolean = false) {
      this._id = department._id
      this.name = department.name;
      this.manager = department.manager?.toString();
      this.organization = department.organization.toString();
  
      // Conditionally include skills based on the includeSkills flag
      if (includeSkills && department.skills) {
        //this.skills = department.skills as ISkill[];
      }
    }
  }