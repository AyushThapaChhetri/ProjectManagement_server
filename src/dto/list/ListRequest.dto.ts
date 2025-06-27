import { Example } from "tsoa";

export class ListRequest {
  @Example("Design the dashboard UI")
  name!: string; //! will be assigned before use

  @Example("c289f43e-89de-42ef-8e1a-35a222d1ac12")
  projectUid!: string;
}
