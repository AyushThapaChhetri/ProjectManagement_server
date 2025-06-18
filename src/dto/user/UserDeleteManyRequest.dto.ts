import { Example } from "tsoa";

export class DeleteUsersRequest {
  @Example([
    "ea66ffbf-85dc-4236-8f22-30bea8aa5b17",
    "f5998680-6dd6-4c23-adea-db481e464c6d",
    "7bac1c8a-b026-463b-a988-ea29468010c4",
  ])
  uids!: string[];
}
