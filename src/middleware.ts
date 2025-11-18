export class ErrorLoggerMiddleware {
  public static catchAsync(fn: any) {
    return function (req: any, res: any, next: any) {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}