import { PrivilegeRepository } from "../../repository/privilege/privilege.repository";
import { NotFoundError } from "../contract/errors/errors";
import { RoleService } from "../role/role.service";

class _PrivilegeService {
  async findAllPrivilege() {
    const privileges = await PrivilegeRepository.findAll();
    if (!privileges) throw new NotFoundError("Privileges not found");
    return privileges;
  }
  async getPrivilegeByIds(Ids: number[]) {
    const privileges = await PrivilegeRepository.findPrivilegeByIds(Ids);
    if (!privileges) throw new NotFoundError("Privileges not found");
    return privileges;
  }
}

export const PrivilegeService = new _PrivilegeService();
