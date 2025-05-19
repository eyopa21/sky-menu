// filters/typeorm-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    const err: any = exception;

    // PostgreSQL: Unique constraint violation
    if (err.code === '23505') {
      return response.status(409).json({
        statusCode: 409,
        message: 'Duplicate entry. A record with this value already exists.',
        error: 'Conflict',
      });
    }

    // PostgreSQL: Foreign key violation
    if (err.code === '23503') {
      return response.status(400).json({
        statusCode: 400,
        message: 'Invalid reference. Foreign key constraint failed.',
        error: 'Bad Request',
      });
    }

    // Default fallback
    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: err.message,
    });
  }
}
