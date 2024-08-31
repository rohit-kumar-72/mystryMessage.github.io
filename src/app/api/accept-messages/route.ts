import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { User } from "next-auth";

export async function POST(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    const userId = user._id;
    const { acceptMessage } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages: acceptMessage
            },
            { new: true }
        )
        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "unable to update user message acceptance status"
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: "message acceptance status updated successfully",
            updatedUser
        }, { status: 200 })
    } catch (error) {
        console.log("Failed to update user status to accept messages ", error)
        return NextResponse.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })
    }
}


export async function GET(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "user message acceptance state fetched successfully",
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 })
    } catch (error) {
        console.log("Failed to get user status to accept messages ", error)
        return NextResponse.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, { status: 500 })
    }
}