const { Chatmodel } = require("../models/chat.model");

    /*** Create chat */

 const createChat = async (req, res) => {
    try {
      const { firstId, secondId } = req.body;
        
      /** Here checking by both id if chat is present send the that chat */
      const chat = await Chatmodel.findOne({ members: { $all: [firstId, secondId] } }).populate({
        path: 'members',
        select: 'name ', // Populate name and info fields
      });
      if (chat) {
        return res.status(200).json({msg:" chat room alraedy",chat});  // here I am return the chat if both user present  else create new chat
      }  

        /** Here I am creating new Chat */

      const newChat = new Chatmodel({ members: [firstId, secondId] })
       console.log("newchat*****",newChat)
      const response = await newChat.save();
        
      res.status(201).json({msg:"Created new chats",response}); // 201 for successful resource creation
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' }); // 500 for generic server error
    }
  };
 

   /*** Find chats by userId in any chat */
   
  const FindUserchats = async (req, res) => {
    try {
      const userId = req.params.userId;

       /*** here I am searching if user is any chat tehn given that Id */
      const chats = await Chatmodel.find({ members: { $in: [userId] } }).populate({
        path: 'members',
        select: 'name info', // Populate name and info fields
      });;
      
      res.status(200).json(chats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

    /*** Get single chat by Ids   */

  const getChatByUserIds = async (req, res) => {
    try {
      const { firstId, secondId } = req.params;
      const singleChat = await Chatmodel.findOne({ members: { $all: [firstId, secondId] } }).populate({
        path: 'members',
        select: 'name info', // Populate name and info fields
      });;
  
      res.status(200).json({msg:"Singlechat",singleChat});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = { createChat, FindUserchats, getChatByUserIds };
