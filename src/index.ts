import { parse } from './lib/parse';
import { print } from './lib/print';

export function ccccc(source: string): string {
    const parsed = parse(source);
    const printed = print(parsed);
    return printed;
}
