import { parse } from './lib/parse';
import { print } from './lib/print/print';
import { FastPath } from './lib/fast-path';

export function ccccc(source: string): string {
    const parsed = parse(source);
    const printed = print(new FastPath(parsed));
    return printed;
}
