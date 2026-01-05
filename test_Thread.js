const { createThreadAndRun, runOnExistingThread, getThreadMessages } = require('../index');

async function testAssistant() {
  // Replace with your actual Assistant ID
  const ASSISTANT_ID = 'asst_IkpqTGqEUWTzvlN85eFl1uxg';
  
  console.log('Testing OpenAI Assistant Integration...\n');

  // Test 1: Create new thread and send message
  console.log('=== Test 1: Create new thread ===');
  const response1 = await createThreadAndRun(
    "{ \"tipo_respuesta\": \"dirección\", \"respuesta\": \"vivo en Quito en la calle Japón\" }",
    ASSISTANT_ID
  );
  console.log('Response:', JSON.stringify(response1, null, 2));
  console.log('\n---\n');

  // Test 2: Continue conversation with existing thread
  /*if (response1.success && response1.threadId) {
    console.log('=== Test 2: Run on existing thread ===');
    const response2 = await runOnExistingThread(
      "{ \"tipo_respuesta\": \"dirección\", \"respuesta\": \"Para qué necesitan mi dirección?\" }",
      response1.threadId,
      ASSISTANT_ID
    );
    console.log('Response:', JSON.stringify(response2, null, 2));
    console.log('\n---\n');

    // Test 3: Another message on same thread
    console.log('=== Test 3: Another message on same thread ===');
    const response3 = await runOnExistingThread(
      "{ \"tipo_respuesta\": \"nombre\", \"respuesta\": \"Me llamo Nicolás Vallejo\" }",
      response1.threadId,
      ASSISTANT_ID
    );
    console.log('Response:', JSON.stringify(response3, null, 2));
    console.log('\n---\n');

    // Test 4: Get all messages from thread
    console.log('=== Test 4: Get all thread messages ===');
    const messages = await getThreadMessages(response1.threadId);
    console.log('Messages:', JSON.stringify(messages, null, 2));
  }*/
}

// Uncomment to run tests
testAssistant().catch(console.error);