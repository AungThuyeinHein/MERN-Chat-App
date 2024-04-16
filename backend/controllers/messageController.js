import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    //Socket.io functionility

    // await conversation.save();
    // await newMessage.save();
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error sending message", error.message);
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error sending message", error.message);
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
};
