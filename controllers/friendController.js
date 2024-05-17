const prisma = require("../db/db.config")

exports.sendFriendRequest = async (req, res) => {
    const senderId = req.user.id;
    const receiverId = req.body.receiverId;
    try {
        await prisma.friendRequest.create({
            data: {
                senderId: senderId,
                receiverId: receiverId
            }
        })
        res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error sending friend request" });
    }
}

exports.acceptRequest = async (req, res) => {
    const receiverId = req.user.id;
    const senderId = req.body.senderId;
    try {
        const friendRequest = await prisma.friendRequest.findFirst({
            where: {
                senderId: senderId,
                receiverId: receiverId,
            },
        });
        if (!friendRequest) {
            return res.status(400).json({ message: "No Friend Request Found" });
        }
        await prisma.friendRequest.delete({
            where: {
                requestId: friendRequest.requestId,
            },
        });
        await prisma.friend.createMany({
            data: [
                {
                    user1Id: friendRequest.senderId,
                    user2Id: friendRequest.receiverId,
                }, {
                    user1Id: friendRequest.receiverId,
                    user2Id: friendRequest.senderId
                }
            ],
        });
        res.status(200).json({ message: "Friend Request Accepted Succesfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error accepting friend request" });
    }
}

exports.fetchAllFriends = async (req, res) => {
    const id = req.user.id;
    try {
        const friends = await prisma.friend.findMany({
            where: {
                user1Id: id,
            },
            include: {
                user2: true
            }
        });
        res.status(200).json({ data: friends });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching all friends" });
    }
}

exports.fetchAllRequests = async (req, res) => {
    const id = req.user.id;
    try {
        const sentRequests = await prisma.friendRequest.findMany({
            where: {
                senderId: id
            },
            include: {
                receiver: true
            }
        });

        const receivedRequests = await prisma.friendRequest.findMany({
            where: {
                receiverId: id
            },
            include: {
                sender: true
            }
        });
        const data = {
            sent: sentRequests.map(elem => ({
                id: elem.sentRequest,
                receiver: {
                    id: elem.receiver.id,
                    name: elem.receiver.name
                }
            })
            ),
            received: receivedRequests.map(request => ({
                id: request.requestId,
                sender: {
                    id: request.sender.id,
                    name: request.sender.name
                }
            })),
        }
        res.status(200).json({ message: "Friend Request Fetched Successfully", data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching friend requests" });
    }
}