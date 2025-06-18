import RoleRepository from "../../repository/role/role.repository";

class RoleService {
  async create(name: string) {
    return await RoleRepository.create(name);
  }

  async findAll() {
    return await RoleRepository.findAll();
  }

  async assignPrivilege(roleId: number, privilegeId: number) {
    return RoleRepository.assignPrivilege(roleId, privilegeId);
  }
}

export default new RoleService();
