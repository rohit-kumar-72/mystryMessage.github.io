import {
    Html,
    Font,
    Body,
    Heading,
    Row,
    Text,
} from "@react-email/components";

interface verificationEmailProps {
    username: string;
    otp: string;
}

function VerificationEmail({ username, otp }: verificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Row>
                <Heading>
                    Hello, {username}
                </Heading>
            </Row>
            <Row>
                <Text>
                    OTP: {otp}
                </Text>
            </Row>
        </Html>
    )
}

export default VerificationEmail;