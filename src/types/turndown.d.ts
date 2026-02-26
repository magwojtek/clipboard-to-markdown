declare module 'turndown' {
    export interface Options {
        headingStyle?: 'setext' | 'atx';
        hr?: string;
        bulletListMarker?: '-' | '+' | '*';
        codeBlockStyle?: 'indented' | 'fenced';
        fence?: '```' | '~~~';
        emDelimiter?: '_' | '*';
        strongDelimiter?: '**' | '__';
        linkStyle?: 'inlined' | 'referenced';
        linkReferenceStyle?: 'full' | 'collapsed' | 'shortcut';
        br?: string;
        blankReplacement?: (content: string, node: Node) => string;
        keepReplacement?: (content: string, node: Node) => string;
        defaultReplacement?: (content: string, node: Node) => string;
    }

    export interface Rule {
        filter: string | string[] | ((node: HTMLElement) => boolean);
        replacement: (content: string, node: HTMLElement, options: Options) => string;
    }

    export default class TurndownService {
        constructor(options?: Options);
        addRule(key: string, rule: Rule): this;
        keep(filter: string | string[] | ((node: HTMLElement) => boolean)): this;
        remove(filter: string | string[] | ((node: HTMLElement) => boolean)): this;
        use(plugin: (service: TurndownService) => void): this;
        turndown(html: string | HTMLElement): string;
        options: Options;
    }
}
