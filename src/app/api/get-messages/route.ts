import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { User } from "next-auth";
import mongoose from "mongoose";


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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])

        if (!user || user.length === 0) {
            return NextResponse.json({
                success: false,
                message: "no messages found"
            }, { status: 401 })
        }

        return NextResponse.json({
            success: false,
            messages: user[0].messages
        }, { status: 200 })
    } catch (error) {
        console.log("error while fetching messages")
        return NextResponse.json({
            success: false,
            messages: "Error while fetching messages"
        }, { status: 401 })
    }
}