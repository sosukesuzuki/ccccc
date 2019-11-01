import { parse as parseWithBabel } from '@babel/parser';
import { File } from '@babel/types';

export function parse(source: string): File {
    return parseWithBabel(source);
}
