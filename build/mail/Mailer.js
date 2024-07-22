import log from 'loglevel';
import aws from 'aws-sdk';
import emailValidator from 'email-validator';
import { Template } from './Template';
aws.config.update({ region: 'us-east-1' });
export class Mailer {
    template;
    content;
    constructor(env) {
        let credentials = new aws.SharedIniFileCredentials({
            profile: env.AWS_PROFILE
        });
        aws.config.credentials = credentials;
    }
    prepare(file, variables) {
        this.template = new Template(file);
        this.content = this.template.setTemplateVariables(variables);
    }
    validateEmail(input) {
        const found = input.match(/<(.+)>/);
        if (found) {
            return emailValidator.validate(found[1]);
        }
        return emailValidator.validate(input);
    }
    validateRecipient(recipient) {
        if (Array.isArray(recipient)) {
            for (let idx = 0; idx < recipient.length; idx++) {
                if (!this.validateEmail(recipient[idx])) {
                    log.error("Invalid recipient in array: " + String(recipient[idx]));
                    return false;
                }
            }
        }
        else if (!this.validateEmail(recipient)) {
            log.error("Invalid recipient: " + String(recipient));
            return false;
        }
        return true;
    }
    validateSender(sender) {
        if (!this.validateEmail(sender)) {
            log.error("Invalid sender: " + String(sender));
            return false;
        }
        return true;
    }
    send(recipient, sender, subject, replyTo = null) {
        if (!this.content) {
            log.error("No content prepared for email to send");
            return false;
        }
        if (!this.validateRecipient(recipient) || !this.validateSender(sender)) {
            return false;
        }
        if (!Array.isArray(recipient)) {
            recipient = [recipient];
        }
        if (!replyTo) {
            replyTo = [sender];
        }
        else if (Array.isArray(replyTo)) {
            for (let idx = 0; idx < replyTo.length; idx++) {
                if (!emailValidator.validate(replyTo[idx])) {
                    log.error("Invalid replyTo in array: " + String(replyTo[idx]));
                    return false;
                }
            }
        }
        else if (!emailValidator.validate(replyTo)) {
            replyTo = [sender];
        }
        if (!Array.isArray(replyTo)) {
            replyTo = [replyTo];
        }
        let mail = {
            Destination: {
                ToAddresses: recipient
            },
            Source: sender,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: this.content
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: this.content
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            ReplyToAddresses: replyTo
        };
        return this._send(mail, recipient);
    }
    sendText(recipient, sender, message, replyTo = null) {
        if (!message) {
            log.error("No message to text");
            return false;
        }
        if (!this.validateRecipient(recipient) || !this.validateSender(sender)) {
            return false;
        }
        if (!Array.isArray(recipient)) {
            recipient = [recipient];
        }
        if (!replyTo) {
            replyTo = [sender];
        }
        else if (Array.isArray(replyTo)) {
            for (let idx = 0; idx < replyTo.length; idx++) {
                if (!emailValidator.validate(replyTo[idx])) {
                    log.error("Invalid replyTo in array: " + String(replyTo[idx]));
                    return false;
                }
            }
        }
        else if (!emailValidator.validate(replyTo)) {
            replyTo = [sender];
        }
        if (!Array.isArray(replyTo)) {
            replyTo = [replyTo];
        }
        let mail = {
            Destination: {
                BccAddresses: recipient
            },
            Source: sender,
            Message: {
                Body: {
                    Text: {
                        Charset: "UTF-8",
                        Data: message
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: ""
                }
            },
            ReplyToAddresses: replyTo
        };
        return this._send(mail, recipient);
    }
    _send(mail, recipient) {
        const SES = new aws.SES({
            apiVersion: "2010-12-01"
        });
        let sendPromise = SES.sendEmail(mail).promise();
        sendPromise.then(data => {
            log.info('[ses:info] Email delivered: ' + String(data.MessageId) + ' - ' + String(recipient));
        }).catch(err => {
            log.error('[ses:error]', err, err.stack);
        });
        return sendPromise;
    }
}
//# sourceMappingURL=Mailer.js.map