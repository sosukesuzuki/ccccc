import { parse as parseWithBabel } from '@babel/parser';
import { Statement } from '@babel/types';

export function parse(source: string): Statement[] {
    return parseWithBabel(source).program.body;
}
