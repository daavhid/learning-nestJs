import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

type PrimitiveType = StringConstructor | NumberConstructor | BooleanConstructor;

type ParamSpec = {
  name: string;
  description?: string;
  type?: PrimitiveType;
  example?: unknown;
};

type QuerySpec = {
  name: string;
  type: PrimitiveType | Type<unknown>;
  required?: boolean;
  description?: string;
  example?: unknown;
  isArray?: boolean;
};

type BaseDocOptions = {
  summary: string;
  description?: string;
  auth?: boolean;
};

type MutationDocOptions = BaseDocOptions & {
  body?: Type<unknown>;
  response?: Type<unknown>;
};

type GetOneDocOptions = BaseDocOptions & {
  response?: Type<unknown>;
  params?: ParamSpec[];
};

type GetManyDocOptions = BaseDocOptions & {
  response?: Type<unknown>;
  queries?: QuerySpec[];
  isArray?: boolean;
  params?: ParamSpec[];
};

type UpdateDocOptions = BaseDocOptions & {
  body?: Type<unknown>;
  response?: Type<unknown>;
  params?: ParamSpec[];
};

type DeleteDocOptions = BaseDocOptions & {
  params?: ParamSpec[];
  body?: Type<unknown>;
};

function withAuth(decorators: MethodDecorator[], auth?: boolean) {
  if (!auth) return decorators;

  decorators.push(ApiBearerAuth('JWT-auth'));
  decorators.push(ApiUnauthorizedResponse({ description: 'Unauthorized' }));
  decorators.push(ApiForbiddenResponse({ description: 'Forbidden' }));

  return decorators;
}

function withParams(decorators: MethodDecorator[], params?: ParamSpec[]) {
  if (!params?.length) return decorators;

  for (const param of params) {
    decorators.push(
      ApiParam({
        name: param.name,
        description: param.description,
        type: param.type ?? String,
        example: param.example,
      }),
    );
  }

  return decorators;
}

function withQueries(decorators: MethodDecorator[], queries?: QuerySpec[]) {
  if (!queries?.length) return decorators;

  for (const query of queries) {
    decorators.push(
      ApiQuery({
        name: query.name,
        type: query.type,
        required: query.required ?? false,
        description: query.description,
        example: query.example,
        isArray: query.isArray,
      }),
    );
  }

  return decorators;
}

export function ApiCreateDoc(options: MutationDocOptions) {
  const decorators: MethodDecorator[] = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
    ApiCreatedResponse({
      description: options.description ?? 'Resource created successfully',
      type: options.response,
    }),
    ApiBadRequestResponse({ description: 'Invalid request payload' }),
  ];

  if (options.body) {
    decorators.push(ApiBody({ type: options.body }));
  }

  withAuth(decorators, options.auth);

  return applyDecorators(...decorators);
}

export function ApiGetOneDoc(options: GetOneDocOptions) {
  const decorators: MethodDecorator[] = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
    ApiOkResponse({
      description: options.description ?? 'Resource fetched successfully',
      type: options.response,
    }),
    ApiBadRequestResponse({ description: 'Invalid request' }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
  ];

  withParams(decorators, options.params);
  withAuth(decorators, options.auth);

  return applyDecorators(...decorators);
}

export function ApiGetManyDoc(options: GetManyDocOptions) {
  const decorators: MethodDecorator[] = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
    ApiOkResponse({
      description: options.description ?? 'Resources fetched successfully',
      type: options.response,
      isArray: options.isArray,
    }),
    ApiBadRequestResponse({ description: 'Invalid request' }),
  ];

  withQueries(decorators, options.queries);
  withAuth(decorators, options.auth);

  return applyDecorators(...decorators);
}

export function ApiUpdateDoc(options: UpdateDocOptions) {
  const decorators: MethodDecorator[] = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
    ApiOkResponse({
      description: options.description ?? 'Resource updated successfully',
      type: options.response,
    }),
    ApiBadRequestResponse({ description: 'Invalid request payload' }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
  ];

  if (options.body) {
    decorators.push(ApiBody({ type: options.body }));
  }

  withParams(decorators, options.params);
  withAuth(decorators, options.auth);

  return applyDecorators(...decorators);
}

export function ApiDeleteDoc(options: DeleteDocOptions) {
  const decorators: MethodDecorator[] = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
    ApiNoContentResponse({
      description: options.description ?? 'Resource deleted successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid request' }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
  ];

  withParams(decorators, options.params);
  withAuth(decorators, options.auth);

  return applyDecorators(...decorators);
}
