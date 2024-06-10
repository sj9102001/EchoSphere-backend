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

exports.fetchFeed=async(req,res)=>{
    const authorId=req.user.id
    try{        
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
        res.status(200).json({message:"Feed Fetched",posts})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}
