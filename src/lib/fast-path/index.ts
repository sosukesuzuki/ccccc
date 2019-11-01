import { Node, File } from '@babel/types';

export class FastPath {
    private stack: Node[];
    constructor(ast: File) {
        this.stack = [ast];
    }

    public getValue(): Node {
        const s = this.stack;
        return s[s.length - 1];
    }

    public getNode(count = 1) {
        const s = this.stack;
        return s[s.length - count - 1];
    }

    public call(fn: (p: FastPath) => any, ...names: string[]) {
        const origLen = this.stack.length;
        let value: Node | Node[] | undefined = this.getValue();
        names.forEach(name => {
            value = (value as any)[name] as Node | Node[] | undefined;
            if (value) {
                if (Array.isArray(value)) {
                    this.stack.push(...value);
                } else {
                    this.stack.push(value);
                }
            }
        });
        const result = fn(this);
        this.stack.length = origLen;
        return result;
    }
}
