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
    switch (code) {
      case "P2002":
        return { code: 400, message: "Already exists" };
      case "P2025":
        return { code: 404, message: "Record not found" };
      default:
        return { code: 500, message: "Database error" };
    }
  }
}
