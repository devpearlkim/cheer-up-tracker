import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function validationError(err: ZodError) {
  const fields = err.issues.reduce(
    (acc, issue) => {
      const path = issue.path.join('.');
      if (!acc[path]) {
        acc[path] = [];
      }
      acc[path].push(issue.message);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return NextResponse.json(
    {
      error: 'Validation failed',
      fields,
    },
    { status: 400 },
  );
}

export function notFound(resource = 'Resource') {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}
