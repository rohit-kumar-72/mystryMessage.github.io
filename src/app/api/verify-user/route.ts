import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { username, verifyCode } = await request.json();

        const user = await UserModel.findOne({ username });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "invalid username"
            }, { status: 400 })
        }

        const isCodeValid = user.verifyCode === verifyCode;

        const isVerifiedBeforeExpiry = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isVerifiedBeforeExpiry) {
            user.isVerified = true;
            await user.save();

            return NextResponse.json({
                success: true,
                message: "verification successful"
            }, { status: 200 })
        } else if (!isVerifiedBeforeExpiry) {
            return NextResponse.json({
                success: false,
                message: "verification code expired please signup again."
            }, { status: 400 })
        } else {
            return NextResponse.json({
                success: false,
                message: "invalid verification code"
            }, { status: 400 })
        }

    } catch (error) {
        console.error("Error verifying user ", error)
        return NextResponse.json({
            success: false,
            message: "Error while verifying user email"
        }, { status: 500 })
    }
}