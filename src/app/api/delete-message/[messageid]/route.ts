import UserModel from "@/model/User";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: NextRequest, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid;
    dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            messages: "Please log in to delete Message"
        }, { status: 401 })
    }
    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            {
                $pull: {
                    messages: { _id: messageId }
                }
            }
        )
        if (updateResult.modifiedCount == 0) {
            return NextResponse.json({
                success: false,
                messages: "Message not found or already deleted"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            messages: "message deleted successfully"
        }, { status: 200 })
    } catch (error) {
        console.error("error while deleting messages", error)
        return NextResponse.json({
            success: false,
            messages: "Error while deleting messages"
        }, { status: 500 })
    }
}