import {
    Statement,
    Node,
    Pattern,
    Identifier,
    RestElement,
    TSParameterProperty,
} from '@babel/types';

function printFunctionParameters(
    params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
    parts: string[],
): void {
    parts.push('(');

    for (let i = 0; i < params.length; i++) {
        const prop = params[i];
        const shouldPrintCommma = i !== params.length - 1;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        parts.push(printNode(prop) + (shouldPrintCommma ? ',' : ''));
    }

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
