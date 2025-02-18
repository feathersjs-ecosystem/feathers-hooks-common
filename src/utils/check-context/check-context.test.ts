import { assert, expect } from 'vitest';

import { checkContext } from './check-context';
import { HookContext } from '@feathersjs/feathers';

const make = (type: any, method: any) => ({ type, method }) as HookContext;

describe('util checkContext', () => {
  it('handles "any" type and method', () => {
    expect(() => checkContext(make('before', 'create'))).not.toThrow();
  });

  it('handles expected type', () => {
    expect(() => checkContext(make('before', 'create'), 'before')).not.toThrow();
  });

  it('handles unexpected type', () => {
    expect(() => checkContext(make('after', 'create'), 'before')).toThrow();
  });

  it('handles undefined type', () => {
    expect(() => checkContext(make('after', 'create'), undefined, 'create')).not.toThrow();
  });

  it('handles null type', () => {
    expect(() => checkContext(make('after', 'create'), null, 'create')).not.toThrow();
  });

  it('handles expected type as array', () => {
    expect(() => checkContext(make('before', 'create'), ['before', 'after'])).not.toThrow();
  });

  it('handles unexpected type as array', () => {
    expect(() => checkContext(make('error', 'create'), ['before', 'after'])).toThrow();
  });

  it('handles expected method as string', () => {
    expect(() => checkContext(make('before', 'create'), null, 'create')).not.toThrow();
  });

  it('handles unexpected method as string', () => {
    expect(() => checkContext(make('before', 'patch'), null, 'create')).toThrow();
  });

  it('handles expected method as array', () => {
    expect(() =>
      checkContext(make('before', 'create'), null, ['create', 'update', 'remove']),
    ).not.toThrow();
  });

  it('handles unexpected method as array', () => {
    expect(() =>
      checkContext(make('before', 'patch'), null, ['create', 'update', 'remove']),
    ).toThrow();
  });

  it('handles undefined method', () => {
    expect(() => checkContext(make('before', 'patch'), null, undefined)).not.toThrow();
  });

  it('handles null method', () => {
    expect(() => checkContext(make('before', 'patch'), null, null)).not.toThrow();
  });

  it('handles expected type and method as array', () => {
    expect(() =>
      checkContext(make('before', 'create'), ['before', 'after'], ['create', 'update', 'remove']),
    ).not.toThrow();
  });

  it('allows custom methods', () => {
    expect(() => checkContext(make('before', 'custom'), 'before', 'create')).toThrow();
    expect(() =>
      checkContext(make('before', 'custom'), 'before', ['create', 'custom']),
    ).not.toThrow();
  });
});
