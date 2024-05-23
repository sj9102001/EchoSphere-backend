const prisma = require("../db/db.config")

exports.createPost= async(req,res)=>{
    const authorId=req.user.id
    const {content}=req.body
    const {mediaLink}=req.body
    try{
        const post=await prisma.post.create({
            data:{
                content,
                mediaLink,
                authorId
            },
        })
        res.status(201).json({message:"Post Created",post})
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

exports.deletePost=async(req,res)=>{
    const authorId=req.user.id
    const {id}=req.body
    try{
        const post=await prisma.post.delete({
            where:{
                authorId,
                id
            },
        })
        res.status(200).json({message:"Post Deleted",post})
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

exports.updatePost=async(req,res)=>{
    const authorId=req.user.id
    const {id,content,mediaLink}=req.body
    try{
        const post=await prisma.post.update({
            where:{
                authorId,
                id
            },
            data:{
                content,
                mediaLink
            }
        })
        res.status(200).json({message:"Post Updated",post})
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

exports.fetchPost=async(req,res)=>{
    const authorId=req.user.id
    try{
        const post=await prisma.post.findMany({
            where:{
                authorId
            }
        })
        res.status(200).json({message:"Post Fetched",post})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

// exports.fetchFeed = async (req, res) => {
//     const authorId = req.user.id;
//     try {
//         const posts = await prisma.post.findMany({
//             where: {
//                 authorId: {
//                     in: prisma.Friend.findMany({
//                         where: {
//                             user1Id: authorId
//                         },
//                         include: {
//                             user2: true
//                         }
//                     }).then(friends => friends.map(friend => friend.user2Id))
//                 }
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             },
//             include: {
//                 author: {
//                     select: {
//                         name: true
//                     }
//                 }
//             }
//         });
//         res.status(200).json({ message: "Feed Fetched", posts });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal Server Error"});
//     }
// }


exports.fetchFeed=async(req,res)=>{
    const authorId=req.user.id
    try{
        const test = await prisma.user.findUnique({
            where: {
              id: authorId
            },
            select: {
              friends: {
                // select: {
                //   friend: true
                // },
                where: {
                  OR: [
                    { user1Id: authorId },
                    { user2Id: authorId }
                  ]
                }
              },
              posts: true
            //    {
            //     where: {
            //       authorId: {
            //         in: friends.flatMap(friend => friend.user1Id === authorId ? friend.user2Id : friend.user1Id)
            //       }
            //     }
            //   }
            }
          });
          

        const friendIds = await prisma.Friend.findMany({
            where:{
                user1Id:authorId
            },
            select:{
                user2Id:true
            }
        })
        const posts=await prisma.post.findMany({
            where:{
                authorId:{in:friendIds.user2Id}
            },
            orderBy:{
                createdAt:'desc'
            },
            include:{
                author:{
                    select:{
                        name:true
                    }
                }
            }
        })
        res.status(200).json({message:"Feed Fetched",test})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}



// exports.fetchFeed = async (req, res) => {
//     const authorId = req.user.id;

//     try {
//         // Step 1: Find all friends of the user
//         const friends = await prisma.friend.findMany({
//             where: {
//                 OR: [
//                     { user1Id: authorId },
//                     { user2Id: authorId }
//                 ]
//             },
//             select: {
//                 user1Id: true,
//                 user2Id: true
//             }
//         });

//         // Extract friend IDs
//         const friendIds = friends.flatMap(friend => 
//             friend.user1Id === authorId ? friend.user2Id : friend.user1Id
//         );

//         // Step 2: Fetch posts from these friends
//         const posts = await prisma.post.findMany({
//             where: {
//                 authorId: { in: friendIds }
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             },
//             include: {
//                 author: true // Optional: to include author details in the response
//             }
//         });

//         // Step 3: Return the posts
//         res.status(200).json({ message: "Feed Fetched", posts });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// router.post('/create', verifyUser, postController.createPost);
// router.delete('/delete', verifyUser, postController.deletePost);
// router.put('/update', verifyUser, postController.updatePost);
// router.get('/fetch', verifyUser, postController.fetchPost);
// router.get('/feed', verifyUser, postController.fetchFeed);

// add post
// delete post
//  update post
//  fetch post of user
//  fetch feed ( feed me basically, posts of all friends sorted by time )