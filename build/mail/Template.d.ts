export declare class Template {
    private content;
    private variables;
    constructor(file: string);
    private collectVariables;
    private validate;
    setTemplateVariables(variables: {
        [key: string]: string;
    }): string;
}
//# sourceMappingURL=Template.d.ts.map