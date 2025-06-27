// src/dto/project/ProjectDTO.ts
// import { ProjectResponse } from "./ProjectResponse.dto";

// class ProjectDTO {
//   single(project: any): ProjectResponse {
//     return {
//       uid: project.uid,
//       name: project.name,
//       description: project.description,
//       deadline: project.deadline?.toISOString() ?? null,
//       createdAt: project.createdAt.toISOString(),
//       updatedAt: project.updatedAt.toISOString(),
//       managerUid: project.managerUid ?? null,
//       createdByUid: project.createdByUid ?? null,
//     };
//   }
// }

// export default new ProjectDTO();

// src/dto/project/ProjectDTO.ts
import { ProjectResponse } from "./ProjectResponse.dto";

type RawOrJoinedProject = {
  uid: string;
  name: string;
  description: string | null;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
  manager?: { uid: string } | null;
  createdBy?: { uid: string } | null;
  managerUid?: string | null;
  createdByUid?: string | null;
};

class _ProjectDTO {
  single(project: RawOrJoinedProject): ProjectResponse {
    return {
      uid: project.uid,
      name: project.name,
      description: project.description,
      deadline: project.deadline?.toISOString() ?? null,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      managerUid: project.manager?.uid ?? project.managerUid ?? null,
      createdByUid: project.createdBy?.uid ?? project.createdByUid ?? null,
    };
  }

  list(projects: RawOrJoinedProject[]): ProjectResponse[] {
    return projects.map((p) => this.single(p));
  }
}

export const ProjectDTO = new _ProjectDTO();
