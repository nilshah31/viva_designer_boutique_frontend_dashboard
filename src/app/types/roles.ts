export enum Role {
  Admin = "admin",
  Staff = "staff",
  Tailor = "tailor",
}

export const ROLE_PERMISSIONS: Record<Role, {
  name: string;
  canDeleteCustomer: boolean;
  canManageUsers: boolean;
  canViewMeasurements: boolean;
  canEditMeasurements: boolean;
  canAddCustomer: boolean;
  canEditCustomer: boolean;
}> = {
  [Role.Admin]: {
    name: "Admin",
    canDeleteCustomer: true,
    canManageUsers: true,
    canViewMeasurements: true,
    canEditMeasurements: true,
    canAddCustomer: true,
    canEditCustomer: true,
  },
  [Role.Staff]: {
    name: "Staff",
    canDeleteCustomer: false,
    canManageUsers: false,
    canViewMeasurements: true,
    canEditMeasurements: true,
    canAddCustomer: true,
    canEditCustomer: true,
  },
  [Role.Tailor]: {
    name: "Tailor",
    canDeleteCustomer: false,
    canManageUsers: false,
    canViewMeasurements: true,
    canEditMeasurements: false,
    canAddCustomer: false,
    canEditCustomer: false,
  },
};
