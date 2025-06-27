// src/dto/list/PatchListRequest.dto.ts
import { Example } from "tsoa";

export class PatchListRequest {
  @Example("New list name")
  name?: string;

  @Example("c289f43e-89de-42ef-8e1a-35a222d1ac12")
  projectUid?: string;
}
