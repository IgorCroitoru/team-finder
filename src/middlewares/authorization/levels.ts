import {RoleType} from '../../shared/enums/index'
type Action = 'edit' | 'delete' | 'view' | 'update' | 'create';

  interface Permission {
    project?: Action[];
    department?: Action[];
    organization?: Action[];
    skill?:Action[];
    category?:Action[];
    userSkill?:Action[];

  }

  const rolePermissions: Record<RoleType, Permission> = {
    [RoleType.EMPLOYEE]: {
      project: ['view'],
      department: ['view'],
      userSkill: ['create'],
    },
    [RoleType.PROJECT_MANAGER]: {
      project: ['view', 'edit', 'delete'],
    },
    [RoleType.DEPARTMENT_MANAGER]: {
      department: ['view', 'edit'],
    },
    [RoleType.ADMIN]: {
      organization: ['view', 'edit'],
    },
  };
  