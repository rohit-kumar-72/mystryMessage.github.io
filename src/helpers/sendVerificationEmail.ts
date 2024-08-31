import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from './../types/apiResponse';

export default async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string,
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry Message | verification mail',
            react: VerificationEmail({ username, otp: verificationCode }),
        });

        return {
            success: true,
            message: "verification email sent successfully."
        }
    } catch (error) {
        console.log("Error sending verification Email", error);
        return {
            success: false,
            message: "Fail sending verification email"
        }
    }
}