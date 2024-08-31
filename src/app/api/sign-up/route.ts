import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import { ApiResponse } from './../../../types/apiResponse';


export async function POST(request: NextRequest) {
    dbConnect();
    try {

        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne(
            {
                username,
                isVerified: true,
            }
        )

        if (existingUserVerifiedByUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: "user already exist and verified please log in."
                } as ApiResponse,
                {
                    status: 400,
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "user already registerd with this email.",
                    }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiry = new Date();
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                isVerified: false,
                isAcceptingMessages: true,
                message: [],
            })

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                {
                    status: 400
                }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "user registered successfully. please verify your email",
            }, { status: 201 })

    } catch (error: any) {
        console.log("Error registering user ", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500,
            }
        )
    }
}