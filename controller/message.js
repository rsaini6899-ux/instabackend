const Message = require('../model/message')
const Conversation = require('../model/conversation')
const { getReceiverSocketId, io } = require("../socket/socketIo")

module.exports.sendMessage = async (req, res) => {
    try {
        const {textMessage:message , senderId } = req.body
        const receiverId = req.params.id
        // const senderId = req.id

        const conversation = await Conversation.findOne(
            { participants: { $all: [senderId, receiverId] } },
            // { $push: { messages: newMessage._id } },
            // { upsert: true, new: true }
        )

        if(!conversation){
            conversation = await Conversation.create({ participants: [senderId, receiverId] })
        }
        
        const newMessage = await Message.create({
             message,
             senderId, 
             receiverId 
        })

        if(newMessage) conversation.message.push(newMessage._id)

        await Promise.all([newMessage.save(), conversation.save()])

        //implement socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){ 
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        return res.status(201).json({ message: newMessage })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

module.exports.getMessages = async (req, res) => {
    try {
        const receiverId = req.params.id
        const senderId = req.headers.senderid
        // console.log('receiverI', receiverId)
        // console.log('senderI', senderId)
        
        const conversation = await Conversation.find(
            { participants: { $all: [senderId, receiverId] } }
        ).populate('message')
        
        if(!conversation) return res.status(200).json({message : []})
            
        return res.status(200).json(conversation)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    
    }
}