import { Request, Response } from "express";

export interface BaseErrorHandler {
  (req: Request, res: Response, exception: Error): void;
}

type Class<T> = abstract new (...args: any[]) => T;

export abstract class BaseError extends Error {
  public static code: Number;
  public context: object;
  constructor(message: string, context: object = {}) {
    super(message);
    this.context = context;
  }

  public static getHandler(): BaseErrorHandler {
    return (_: Request, res: Response, exception: Error) => {
      const casted = exception as BaseError;
      res
        // @ts-ignore
        .status(casted.constructor.code)
        .send({ context: casted.context });
    };
  }
}

export class ValidationError extends BaseError {
  public static code = 422;
}

export class NotFoundError extends BaseError {
  public static code = 404;
}

interface AsyncRun {
  (): Promise<void>;
}

export class ExceptionHandler {
  private exceptionsMap: Map<Class<Error>, BaseErrorHandler> = new Map();

  public register(
    exceptionClass: Class<Error>,
    errorHandler: BaseErrorHandler,
  ) {
    this.exceptionsMap.set(exceptionClass, errorHandler);
  }

  public async withExcepionHandler(
    req: Request,
    res: Response,
    runBlock: AsyncRun,
  ): Promise<void> {
    try {
      await runBlock();
    } catch (e) {
      if (
        e instanceof Error &&
        this.exceptionsMap.has(e.constructor as Class<Error>)
      ) {
        const handler = this.exceptionsMap.get(e.constructor as Class<Error>);
        if (handler !== undefined) handler(req, res, e);
      } else {
        throw e;
      }
    }
  }
}
