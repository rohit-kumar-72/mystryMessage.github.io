import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { Message } from '@/model/User';


export async function POST(request: NextRequest) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username: username })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "no user found"
            }, { status: 404 })
        }
        if (!user.isAcceptingMessages) {
            return NextResponse.json({
                success: false,
                message: "not accepting messages anymore"
            }, { status: 401 })
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message);
        await user.save();

        return NextResponse.json({
            success: true,
            message: "message sent successfully"
        }, { status: 200 })
    } catch (error) {
        console.log("erroe sending messages")
        return NextResponse.json({
            success: false,
            message: "error while sending message"
        }, { status: 401 })
    }
}