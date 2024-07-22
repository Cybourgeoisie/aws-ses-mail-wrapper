# AWS SES mail module

## Usage

Include in your repo

```
npm install https://github.com/Cybourgeoisie/aws-ses-mail-wrapper.git
```

And wherever in the code you need to use it:

```
import * as path from 'path';
import AwsSesMailer from 'aws-ses-mail-node-module';

interface TemplateVariables {
  [key: string]: string;
}

// Create an instance of the mailer with optional AWS configuration
const mailer = new AwsSesMailer({
  AWS_PROFILE: ''
});

// Define the template file path and the variables to be replaced in the template
const templateFile: string = path.join(__dirname, 'email-templates', 'my_template.html');
const templateVariables: TemplateVariables = {
  USER: 'Username',
  VAR_1: 'Red fish, blue fish',
  VAR_2: 'One fish, two fish'
};

// Define recipient, sender, and subject
const recipient: string = 'recipient@test.com';
const sender: string = 'sender@test.com';
const subject: string = 'Template Test';

// Prepare and send the email
mailer.prepare(templateFile, templateVariables);
mailer.send(recipient, sender, subject);

```


## Setup

### Set up your shared AWS credentials

Make sure you have a credentials file that matches the [format according to AWS's standard](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html).

## Testing

### Test config

Before you can run the tests, you need to set up a `.env.test` to designate where the AWS credentials live, and the recipient and sender of the test mail. The required values are all in `.env.test.sample`, and the only values that must be filled in are:

- `TEST_RECIPIENT`
- `TEST_SENDER`

All must be whitelisted for your set of AWS SES credentials, or the credentials must otherwise have authority to send to / from both emails.

```
cp .env.test.sample .env.test
```

### Run tests

```
npm test
```

## Templates

To use a custom template, first create an html template file.

## Example

When creating a template, any variable that you wish to change on a per-email basis should be placed as {{VARIABLE_NAME}}.

```
<p>
  Hello {{USER}}, welcome to our mailing list.
</p>
```

## Contributors

- Adam Gibbons
- Ben Heidorn
- Troy Salem
