import {
    Statement,
    Node,
    Pattern,
    Identifier,
    RestElement,
    TSParameterProperty,
} from '@babel/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function printArray(arr: any[], parts: string[]): void {
    for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        const shouldPrintCommma = i !== arr.length - 1;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        parts.push(printNode(el) + (shouldPrintCommma ? ',' : ''));
    }
}

function printFunctionParameters(
    params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
    parts: string[],
): void {
    parts.push('(');
    printArray(params, parts);
    parts.push(')');
}

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
            printArray(node.elements, parts);
            parts.push(']');
            break;
        }
        case 'ObjectExpression': {
            parts.push('({');
            printArray(node.properties, parts);
            parts.push('})');
            break;
        }
        case 'ObjectProperty': {
            if (node.computed) {
                parts.push('[');
            }
            parts.push(printNode(node.key));
            if (node.computed) {
                parts.push(']');
            }
            if (!node.shorthand) {
                parts.push(':');
                parts.push(printNode(node.value));
            }
            break;
        }
        case 'FunctionExpression':
        case 'FunctionDeclaration': {
            parts.push('(');
            if (node.async) {
                parts.push('async ');
            }
            parts.push('function');
            if (node.generator) {
                parts.push('* ');
            } else {
                parts.push(' ');
            }
            if (node.id) {
                parts.push(printNode(node.id));
            }
            printFunctionParameters(node.params, parts);
            parts.push(printNode(node.body));
            parts.push(')');
            break;
        }
        case 'BlockStatement': {
            parts.push('{');
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            parts.push(print(node.body));
            parts.push('}');
            break;
        }
        case 'ObjectMethod': {
            if (node.kind !== 'method') {
                parts.push(node.kind + ' ');
            }
            if (node.async) {
                parts.push('async' + (node.generator ? '' : ' '));
            }
            if (node.generator) {
                parts.push('*');
            }
            if (node.computed) {
                parts.push('[');
            }
            parts.push(printNode(node.key));
            if (node.computed) {
                parts.push(']');
            }
            printFunctionParameters(node.params, parts);
            parts.push(printNode(node.body));
            break;
        }
        case 'LogicalExpression':
        case 'BinaryExpression': {
            parts.push(printNode(node.left));
            parts.push(node.operator);
            parts.push(printNode(node.right));
            break;
        }
        case 'AwaitExpression': {
            parts.push('await');
            parts.push('(');
            parts.push(printNode(node.argument));
            parts.push(')');
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
