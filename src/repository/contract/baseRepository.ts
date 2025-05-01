import { DBError } from "@app/service/contract/errors/dbErrorHandler";

export default class BaseRepository {
  dbCatch<T>(param: Promise<T>): Promise<T> {
    return param.catch((e) => {
      throw new DBError(e);
    });
  }
}
