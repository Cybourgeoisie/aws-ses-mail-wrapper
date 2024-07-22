import assert from 'assert';
import path from 'path';
import dotenv from 'dotenv';
import aws from 'aws-sdk';
import { Mailer } from '../mail/Mailer'; // Adjust the import based on your export
dotenv.config({
    path: path.join(__dirname, "../.env.test")
});
// Set environment variables to constants with sensible defaults
const TEST_RECIPIENT = process.env.TEST_RECIPIENT || '';
const TEST_SENDER = process.env.TEST_SENDER || '';
const TEST_AWS_PROFILE = process.env.TEST_AWS_PROFILE || '';
const TEST_TEXT_RECIPIENT = process.env.TEST_TEXT_RECIPIENT || '';
describe("Send Test Mail", function () {
    describe("Verify config is set up", function () {
        it(".env.test has recipient and sender set up", function (done) {
            assert(process.env);
            assert(process.env.hasOwnProperty('TEST_RECIPIENT'));
            assert(process.env.hasOwnProperty('TEST_SENDER'));
            done();
        });
        it("AWS can find the required profile", function (done) {
            let credentials = new aws.SharedIniFileCredentials({
                profile: TEST_AWS_PROFILE
            });
            assert(typeof credentials.accessKeyId !== "undefined");
            done();
        });
    });
    describe("Validation", function () {
        const mailer = new Mailer({
            AWS_PROFILE: TEST_AWS_PROFILE
        });
        it("Validate recipient from test environment", function (done) {
            assert(mailer.validateRecipient(TEST_RECIPIENT) === true);
            done();
        });
        it("Validate sender from test environment", function (done) {
            assert(mailer.validateSender(TEST_SENDER) === true);
            done();
        });
        it("Validate recipient without alias", function (done) {
            assert(mailer.validateRecipient(TEST_RECIPIENT) === true);
            done();
        });
        it("Validate sender without alias", function (done) {
            assert(mailer.validateSender(TEST_SENDER) === true);
            done();
        });
        const TEST_ALIAS_SENDER = "An Alias<fakeemail@google.com>";
        it("Validate sender with alias", function (done) {
            assert(mailer.validateSender(TEST_ALIAS_SENDER) === true);
            done();
        });
        const TEST_RECIPIENT_ARRAY = [
            TEST_RECIPIENT,
            TEST_SENDER,
            TEST_ALIAS_SENDER
        ];
        it("Validate recipient array", function (done) {
            assert(mailer.validateRecipient(TEST_RECIPIENT_ARRAY) === true);
            done();
        });
    });
    describe("Send a test email", function () {
        it("Creates aws session and sends email", function (done) {
            const mailer = new Mailer({
                AWS_PROFILE: TEST_AWS_PROFILE
            });
            const template_file = path.join(__dirname, "templates/test.html");
            const template_variables = {
                EMAIL_TITLE: "Email Title",
                EMAIL_CONTENT: "Email content here",
                SITE_URL: "https://blockade.games"
            };
            const recipient = TEST_RECIPIENT;
            const sender = TEST_SENDER;
            const subject = "Template Test";
            mailer.prepare(template_file, template_variables);
            const sent = mailer.send(recipient, sender, subject);
            if (typeof sent === 'boolean') {
                done(new Error("Sent returned a boolean response: " + sent));
            }
            else {
                sent.then((res) => {
                    assert(res);
                    done();
                }).catch((res) => {
                    done(new Error(res));
                });
            }
        });
    });
    describe("Send a test text message", function () {
        if (TEST_TEXT_RECIPIENT && TEST_TEXT_RECIPIENT.length > 0) {
            it("Creates aws session and sends email", function (done) {
                const mailer = new Mailer({
                    AWS_PROFILE: TEST_AWS_PROFILE
                });
                const recipient = TEST_TEXT_RECIPIENT;
                const sender = TEST_SENDER;
                const message = "Test Text Message";
                const sent = mailer.sendText(recipient, sender, message);
                if (typeof sent === 'boolean') {
                    done(new Error("Sent returned a boolean response: " + sent));
                }
                else {
                    sent.then((res) => {
                        assert(res);
                        done();
                    }).catch((res) => {
                        done(new Error(res));
                    });
                }
            });
        }
    });
});
//# sourceMappingURL=send.test.js.map