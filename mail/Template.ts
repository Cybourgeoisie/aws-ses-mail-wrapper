import log from 'loglevel';
import fs from 'fs';

export class Template {
    private content: string;
    private variables: string[];

    constructor(file: string) {
        if (!file) {
            throw new Error('AWS SES Module Template: No file provided');
        }

        this.content = fs.readFileSync(file, 'utf8');
        this.variables = this.collectVariables(this.content);
    }

    private collectVariables(content: string): string[] {
        let regex = new RegExp("{{[A-Za-z0-9_\\-]+}}", "g");

        const matches = (content.match(regex) || []).filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        matches.forEach((el, index, self) => {
            self[index] = el.slice(2, -2);
        });

        return matches;
    }

    private validate(kv: { [key: string]: string }) {
        for (let idx = 0; idx < this.variables.length; idx++) {
            let key = this.variables[idx];
            if (!kv.hasOwnProperty(key)) {
                log.error(`Template variable ${key} is missing.`);
            }
        }
    }

    setTemplateVariables(variables: { [key: string]: string }): string {
        this.validate(variables);

        let contents = this.content.substring(0);

        for (let key in variables) {
            if (variables.hasOwnProperty(key)) {
                let value = variables[key];
                let regex = new RegExp("{{" + key + "}}", "g");
                contents = contents.replace(regex, value);
            }
        }

        return contents;
    }
}
