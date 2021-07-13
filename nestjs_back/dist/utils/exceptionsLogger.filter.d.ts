import { ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
export declare class ExceptionsLoggerFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
