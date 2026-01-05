const OpenAI = require('openai');

/**
 * Create a new thread and run assistant
 * @param {string} message - User input message
 * @param {string} assistantId - OpenAI Assistant ID
 * @returns {Object} Response with assistant message and new thread ID
 */
async function createThreadAndRun(message, assistantId) {
  try {
    console.log('Creating new thread and running assistant...');

    // Create new thread with initial message
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    console.log('Created thread:', thread.id);

    // Create and poll run
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistantId
    });

    console.log('Run status:', run.status);

    // Get messages after run completes
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id, {
        order: 'desc',
        limit: 1
      });
      
      // Get the last message (most recent)
      const lastMessage = messages.data[0];
      
      if (lastMessage && lastMessage.content[0]?.text) {
        return {
          success: true,
          threadId: thread.id,
          response: JSON.parse(lastMessage.content[0].text.value),
          messageId: lastMessage.id,
          messageRole: lastMessage.role,
          runId: run.id
        };
      }
    }

    // Handle non-completed runs
    return {
      success: false,
      threadId: thread.id,
      response: `Run did not complete. Status: ${run.status}`,
      runStatus: run.status,
      runId: run.id
    };

  } catch (error) {
    console.error('Error in createThreadAndRun:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Run assistant on existing thread
 * @param {string} message - User input message
 * @param {string} threadId - Existing OpenAI thread ID
 * @param {string} assistantId - OpenAI Assistant ID
 * @returns {Object} Response with assistant message
 */
async function runOnExistingThread(message, threadId, assistantId) {
  try {
    console.log('Running on existing thread:', threadId);

    // Add user message to existing thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message
    });

    // Create and poll run
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId
    });

    console.log('Run status:', run.status);

    // Get messages after run completes
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(threadId, {
        order: 'desc',
        limit: 1
      });
      
      // Get the last message (most recent)
      const lastMessage = messages.data[0];
      
      if (lastMessage && lastMessage.content[0]?.text) {
        return {
          success: true,
          threadId: threadId,
          response: lastMessage.content[0].text.value,
          messageId: lastMessage.id,
          messageRole: lastMessage.role,
          runId: run.id
        };
      }
    }

    // Handle non-completed runs
    return {
      success: false,
      threadId: threadId,
      response: `Run did not complete. Status: ${run.status}`,
      runStatus: run.status,
      runId: run.id
    };

  } catch (error) {
    console.error('Error in runOnExistingThread:', error);
    return {
      success: false,
      error: error.message,
      threadId: threadId
    };
  }
}

/**
 * Get all messages from a thread
 * @param {string} threadId - OpenAI thread ID
 * @returns {Object} All messages in the thread
 */
async function getThreadMessages(threadId) {
  try {
    const messages = await openai.beta.threads.messages.list(threadId, {
      order: 'desc'
    });
    
    return {
      success: true,
      threadId: threadId,
      lastMessage: messages.data[0] ? {
        id: messages.data[0].id,
        role: messages.data[0].role,
        content: messages.data[0].content[0]?.text?.value || '',
        createdAt: messages.data[0].created_at
      } : null,
      messages: messages.data.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content[0]?.text?.value || '',
        createdAt: msg.created_at
      }))
    };
  } catch (error) {
    console.error('Error getting thread messages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Genesys Cloud Function handler
 * Expected input format from Genesys:
 * {
 *   message: "user message",
 *   threadId: null or "thread_xyz",
 *   assistantId: "asst_xyz"
 * }
 */
exports.handler = async function(event) {
  const { message, threadId, assistantId } = event;

  // Validate required parameters
  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        success: false,
        error: 'Message is required' 
      })
    };
  }

  if (!assistantId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        success: false,
        error: 'Assistant ID is required' 
      })
    };
  }

  let result;

  // Check if threadId is null or undefined - create new thread
  if (!threadId || threadId === null || threadId === 'null') {
    console.log('No thread ID provided - creating new thread');
    result = await createThreadAndRun(message, assistantId);
  } else {
    // Thread ID exists - run on existing thread
    console.log('Thread ID provided - running on existing thread');
    result = await runOnExistingThread(message, threadId, assistantId);
  }

  return {
    statusCode: result.success ? 200 : 500,
    body: JSON.stringify(result)
  };
};

// Export functions for direct use
module.exports = {
  createThreadAndRun,
  runOnExistingThread,
  getThreadMessages,
  handler: exports.handler
};
