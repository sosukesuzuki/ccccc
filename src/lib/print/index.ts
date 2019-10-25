import { Statement, Node } from '@babel/types';

function printNode(node: Node): string {
    const parts: string[] = [];
    switch (node.type) {
        case 'Identifier': {
            parts.push(node.name);
            break;
        }
        case 'NumericLiteral': {
            parts.push(node.value.toString());
            break;
        }
        case 'ExpressionStatement': {
            parts.push(printNode(node.expression));
            break;
        }
        case 'ThisExpression': {
            parts.push('this');
            break;
        }
        case 'ArrayExpression': {
            parts.push('[');
            for (let i = 0; i < node.elements.length; i++) {
                const el = node.elements[i];
                if (el) {
                    const shouldPrintCommma = i !== node.elements.length - 1;
                    parts.push(printNode(el) + (shouldPrintCommma ? ',' : ''));
                }
            }
            parts.push(']');
            break;
        }
        case 'ObjectExpression': {
            parts.push('({');
            for (let i = 0; i < node.properties.length; i++) {
                const prop = node.properties[i];
                const shouldPrintCommma = i !== node.properties.length - 1;
                parts.push(printNode(prop) + (shouldPrintCommma ? ',' : ''));
            }
            parts.push('})');
            break;
        }
        case 'ObjectProperty': {
            parts.push(printNode(node.key));
            if (
                node.value.type !== 'Identifier' ||
                node.key.name !== node.value.name
            ) {
                parts.push(':');
                parts.push(printNode(node.value));
            }
            break;
        }
        case 'LogicalExpression':
        case 'BinaryExpression': {
            parts.push(printNode(node.left));
            parts.push(node.operator);
            parts.push(printNode(node.right));
            break;
        }
        default: {
            throw new Error(`I don't know ${node.type}`);
        }
    }
    return parts.join('');
}

export function print(ast: Statement[]): string {
    const results: string[] = [];
    for (let i = 0; i < ast.length; i++) {
        const node = ast[i];
        results.push(printNode(node) + ';');
    }
    return results.join('');
}
