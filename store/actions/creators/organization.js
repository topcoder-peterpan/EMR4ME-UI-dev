import {
  addUserOrganizations,
  deleteUserOrganization,
  getUserOrganizations,
} from "../../../apis/share";

export const getAllOrganizations = () =>
  getUserOrganizations({ getAllOrganiztions: 1 });

export const getUserSharedOrganizations = () =>
  getUserOrganizations({ getAllOrganiztions: 0 });

export const addSharedOrganization = (data) => addUserOrganizations(data);

export const deleteSharedOrganization = (data) => deleteUserOrganization(data);
