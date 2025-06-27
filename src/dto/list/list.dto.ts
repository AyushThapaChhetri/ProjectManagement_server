// src/dto/list/ListResponse.dto.ts
import { Example } from "tsoa";

/**
 * Raw result shape from ListService.getAllPaginated (with Prisma JOINs)
 */

/**
 * Response data DTO sent to clients
 */

// src/dto/list/list.dto.ts
import { ListResponseData } from "./ListResponse.dto";

type FlatList = {
  uid: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  createdById?: number | null;
  createdBy?: { uid: string } | null;
  projectId?: number;
  project?: { uid: string };
  projectUid?: string | null;
  createdByUid?: string | null;
};

class _ListDTO {
  single(list: FlatList): ListResponseData {
    return {
      uid: list.uid,
      name: list.name,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
      createdByUid: list.createdBy?.uid ?? list.createdByUid ?? "", // fallback if not included
      projectUid: list.project?.uid ?? list.projectUid ?? "", // fallback if not included
    };
  }

  list(lists: FlatList[]): ListResponseData[] {
    return lists.map((l) => this.single(l));
  }
}

export const ListDTO = new _ListDTO();
