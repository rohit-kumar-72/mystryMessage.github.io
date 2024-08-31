import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username')
        }

        // validation with Zod
        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log(result) //TODO: REMOVE LATER

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []

            return NextResponse.json({
                success: false,
                message: usernameErrors?.length > 0
                    ? usernameErrors.join(',')
                    : 'Invalid Username'
            }, { status: 400 })
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return NextResponse.json({
                success: false,
                message: 'username is already taken'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: 'username is Available'
        }, { status: 405 })

    } catch (error) {
        console.error("Error checking username ", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error checking username"
            },
            { status: 500 }
        )
    }
}