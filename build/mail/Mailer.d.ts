import aws from 'aws-sdk';
export declare class Mailer {
    private template;
    private content;
    constructor(env: {
        AWS_PROFILE: string;
    });
    prepare(file: string, variables: {
        [key: string]: string;
    }): void;
    validateEmail(input: string): boolean;
    validateRecipient(recipient: string | string[]): boolean;
    validateSender(sender: string): boolean;
    send(recipient: string | string[], sender: string, subject: string, replyTo?: string | string[] | null): Promise<aws.SES.SendEmailResponse> | boolean;
    sendText(recipient: string | string[], sender: string, message: string, replyTo?: string | string[] | null): Promise<aws.SES.SendEmailResponse> | boolean;
    private _send;
}
//# sourceMappingURL=Mailer.d.ts.map