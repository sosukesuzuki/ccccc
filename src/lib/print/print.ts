import { FastPath } from '../fast-path';

export function print(path: FastPath): string {
    const parts: string[] = [];
    const node = path.getValue();

    switch (node.type) {
        case 'File':
            parts.push(path.call(print, 'program'));
            break;
        case 'Program':
            parts.push(path.call(print, 'body'));
            break;
        case 'ExpressionStatement':
            parts.push(path.call(print, 'expression'));
            break;
        case 'BinaryExpression':
            parts.push(path.call(print, 'left'));
            parts.push(node.operator);
            parts.push(path.call(print, 'right'));
            break;
        case 'NumericLiteral':
            parts.push(node.value.toString());
            break;
        case 'Identifier':
            parts.push(node.name);
            break;
        default:
            throw new Error(`I don't know the type of ${node.type}`);
    }

    console.log(parts);
    return parts.join('');
}
