import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/react';

export let loader: LoaderFunction = async () => {
  return json('', { status: 200 });
};
