import { number } from "yup";
import RoleRepository from "../../repository/role/role.repository";
import { NotFoundError } from "../contract/errors/errors";
import { PrivilegeService } from "../privilege/privilege.service";

class _RoleService {
  async create(name: string) {
    return await RoleRepository.create(name);
  }

  async findAll() {
    return await RoleRepository.findAll();
  }

  async assignPrivilege(roleId: number, privilegeId: number) {
    return RoleRepository.assignPrivilege(roleId, privilegeId);
  }

  async getPrivilegesFromRoles(roles: string[]) {
    console.log("Roles from Role:", roles);
    const privilege = await RoleRepository.findPrivilegesFromRoles(roles);
    if (!privilege) throw new NotFoundError("No privilege Found");

    // [
    //   {
    //     id: 1,
    //     name: "Admin",
    //     rolePrivileges: [{ privilegeId: 101 }, { privilegeId: 102 }]
    //   },
    //   {
    //     id: 2,
    //     name: "User",
    //     rolePrivileges: [{ privilegeId: 101 }]
    //   }
    // ]
    // privilegeIds = [101, 102, 101]
    // uniquePrivilegeIds = [101, 102]

    const privilegeId = privilege.flatMap((role) =>
      // Output: [[1, 2], [3]]
      role.rolePrivileges.map((rp) => rp.privilegeId)
    );
    const uniquePrivilege = new Set(privilegeId);
    const uniquePrivilegeArray = Array.from(uniquePrivilege);

    return await PrivilegeService.getPrivilegeByIds(uniquePrivilegeArray);
  }
}

export const RoleService = new _RoleService();
