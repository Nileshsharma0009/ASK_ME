import ChatHistory from "../models/ChatHistory.js";
import { chatting } from "../rag/query.js";

function buildChatTitle(question) {
  const cleanQuestion = question.trim().replace(/\s+/g, " ");
  return cleanQuestion.length > 80
    ? `${cleanQuestion.slice(0, 77)}...`
    : cleanQuestion;
}

function buildAssistantReply(question) {
  return `I checked the app data first, then the vector knowledge base, then prepared an answer for the LLM. Here is the response for "${question}":\n\n1. Relevant matches were identified from stored knowledge.\n2. Similar documents were ranked through similarity search.\n3. The final answer was formatted into a clear response for the user.\n\nYou can replace this mock response with your real RAG pipeline next.`;
}

function mapConversationSummary(conversation) {
  const firstHumanMessage = conversation.messages.find(
    (message) => message.sender === "human"
  );

  return {
    id: conversation._id,
    title: conversation.title,
    question: firstHumanMessage?.text || conversation.title,
    messageCount: conversation.messages.length,
    updatedAt: conversation.updatedAt,
    createdAt: conversation.createdAt,
  };
}

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, question, history: frontendHistory } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    if (req.user.isGuest) {
      // Guest users bypass DB operations completely
      let ragAnswer = null;
      try {
        const historyList = frontendHistory || [];
        const formattedHistory = historyList.map(m => ({
          role: m.sender === "human" ? "user" : "model",
          content: m.text
        }));
        ragAnswer = await chatting(question.trim(), formattedHistory);
      } catch (err) {
        console.error('RAG pipeline error for guest:', err);
        ragAnswer = null;
      }

      const assistantMessage = {
        sender: "ai",
        text: ragAnswer || buildAssistantReply(question.trim()),
        metadata: {
          retrieval: ["app-db", "vector-db", "similarity-search", "llm"],
          source: "rag-pipeline",
        },
      };

      return res.status(200).json({
        conversationId: "guest-session",
        conversation: {
          id: "guest-session",
          title: "Guest Session",
          messages: [],
          updatedAt: new Date(),
        },
        answer: assistantMessage,
      });
    }

    let conversation = null;

    if (conversationId) {
      conversation = await ChatHistory.findOne({
        _id: conversationId,
        user: req.user.id,
      });
    }

    if (!conversation) {
      conversation = new ChatHistory({
        user: req.user.id,
        title: buildChatTitle(question),
        messages: [],
      });
    }

    const userMessage = {
      sender: "human",
      text: question.trim(),
      metadata: {
        retrieval: [],
        source: "user",
      },
    };

    // call RAG pipeline to get an answer (falls back to mock reply on error)
    let ragAnswer = null;
    try {
      const history = conversation.messages.map(m => ({
        role: m.sender === "human" ? "user" : "model",
        content: m.text
      }));
      ragAnswer = await chatting(question.trim(), history);
    } catch (err) {
      console.error('RAG pipeline error:', err);
      ragAnswer = null;
    }

    const assistantMessage = {
      sender: "ai",
      text: ragAnswer || buildAssistantReply(question.trim()),
      metadata: {
        retrieval: ["app-db", "vector-db", "similarity-search", "llm"],
        source: "rag-pipeline",
      },
    };

    conversation.messages.push(userMessage, assistantMessage);
    conversation.lastMessageAt = new Date();

    await conversation.save();

    return res.status(200).json({
      conversationId: conversation._id,
      conversation: {
        id: conversation._id,
        title: conversation.title,
        messages: conversation.messages,
        updatedAt: conversation.updatedAt,
      },
      answer: assistantMessage,
    });
  } catch (error) {
    console.error("Chat sendMessage error:", error);
    return res.status(500).json({ message: "Failed to process chat message" });
  }
};

export const getHistory = async (req, res) => {
  try {
    if (req.user.isGuest) {
      return res.status(200).json({
        logs: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const search = req.query.search?.trim();

    const query = { user: req.user.id };

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ title: regex }, { "messages.text": regex }];
    }

    const [conversations, total] = await Promise.all([
      ChatHistory.find(query)
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ChatHistory.countDocuments(query),
    ]);

    return res.status(200).json({
      logs: conversations.map(mapConversationSummary),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    console.error("Chat getHistory error:", error);
    return res.status(500).json({ message: "Failed to load conversation history" });
  }
};

export const getConversationById = async (req, res) => {
  try {
    if (req.user.isGuest) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const conversation = await ChatHistory.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.status(200).json({
      conversation: {
        id: conversation._id,
        title: conversation.title,
        messages: conversation.messages,
        updatedAt: conversation.updatedAt,
        createdAt: conversation.createdAt,
      },
    });
  } catch (error) {
    console.error("Chat getConversationById error:", error);
    return res.status(500).json({ message: "Failed to load conversation" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    if (req.user.isGuest) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const deletedConversation = await ChatHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Chat deleteConversation error:", error);
    return res.status(500).json({ message: "Failed to delete conversation" });
  }
};

export const clearHistory = async (req, res) => {
  try {
    if (req.user.isGuest) {
      return res.status(200).json({
        message: "Conversation history cleared successfully",
        deletedCount: 0,
      });
    }

    const result = await ChatHistory.deleteMany({ user: req.user.id });

    return res.status(200).json({
      message: "Conversation history cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Chat clearHistory error:", error);
    return res.status(500).json({ message: "Failed to clear conversation history" });
  }
};
