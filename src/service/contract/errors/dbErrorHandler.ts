export class DBError {
  message: string;
  log?: Object;
  statusCode: number;

  constructor(log?: Object) {
    const { code, message } = this.resolve(log) ?? {};
    this.log = log;
    this.message = message ?? "Something went wrong";
    this.statusCode = code ?? 500;
  }

  resolve(error: any) {
    const { code } = error;
    if (!code) return;
    if (code == "P2002") {
      return {
        code: 400,
        message: "Already exists",
      };
    }
  }
}
