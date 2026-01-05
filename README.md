# assistantAIFunction
// README.md
/*
# OpenAI Assistant Integration for Genesys Cloud Functions

## Functions

### 1. createThreadAndRun(message, assistantId)
Creates a new thread and runs the assistant.
Use when threadId is null/undefined.

**Parameters:**
- message: string - User's message
- assistantId: string - OpenAI Assistant ID

**Returns:**
{
  success: boolean,
  threadId: string,        // CAPTURE THIS
  response: string,        // CAPTURE THIS
  messageId: string,
  messageRole: string,
  runId: string
}

### 2. runOnExistingThread(message, threadId, assistantId)
Runs assistant on existing thread.
Use when you have a threadId from previous conversation.

**Parameters:**
- message: string - User's message
- threadId: string - Existing thread ID
- assistantId: string - OpenAI Assistant ID

**Returns:**
{
  success: boolean,
  threadId: string,        // CAPTURE THIS
  response: string,        // CAPTURE THIS
  messageId: string,
  messageRole: string,
  runId: string
}

### 3. getThreadMessages(threadId)
Retrieves all messages from a thread.

**Parameters:**
- threadId: string - Thread ID

**Returns:**
{
  success: boolean,
  threadId: string,
  lastMessage: Object,
  messages: Array
}

### 4. deleteThread(threadId)
Deletes a thread permanently.

**Parameters:**
- threadId: string - Thread ID to delete

**Returns:**
{
  success: boolean,
  threadId: string,
  deleted: boolean,
  message: string
}

## Genesys Cloud Function Usage

### IMPORTANTE: Valores a capturar en Genesys

En cada respuesta de la Cloud Function, debes capturar estos dos valores:

1. **threadId** - Necesario para mantener la conversación
2. **response** - El mensaje que se muestra al usuario

### Ejemplo de implementación en Genesys:

**Primera llamada (sin thread_id):**
```javascript
// Input a la Cloud Function
{
  "message": "Hola, necesito ayuda",
  "threadId": null,
  "assistantId": "asst_xyz123"
}

// Response de la Cloud Function
{
  "statusCode": 200,
  "body": {
    "threadId": "thread_abc123",           // ← CAPTURAR ESTE VALOR
    "response": "¡Hola! ¿En qué puedo ayudarte?",  // ← CAPTURAR ESTE VALOR
    "success": true,
    "messageId": "msg_xyz",
    "messageRole": "assistant",
    "runId": "run_xyz"
  }
}

// En Genesys:
// 1. Guarda threadId en una variable de conversación
// 2. Muestra response al usuario
```

**Llamadas siguientes (con thread_id):**
```javascript
// Input a la Cloud Function
{
  "message": "¿Cuál es el horario?",
  "threadId": "thread_abc123",  // ← Usa el threadId capturado anteriormente
  "assistantId": "asst_xyz123"
}

// Response de la Cloud Function
{
  "statusCode": 200,
  "body": {
    "threadId": "thread_abc123",           // ← Mismo thread_id
    "response": "Nuestro horario es...",   // ← CAPTURAR Y MOSTRAR
    "success": true,
    "messageId": "msg_abc",
    "messageRole": "assistant",
    "runId": "run_abc"
  }
}
```

### Flujo en Genesys Cloud:

1. **Primera interacción:**
   - Usuario envía mensaje
   - Genesys llama a la Cloud Function con threadId = null
   - Captura el threadId de la respuesta
   - Guarda threadId en variable de conversación (ej: Flow.threadId)
   - Muestra response al usuario

2. **Interacciones siguientes:**
   - Usuario envía mensaje
   - Genesys llama a la Cloud Function con el threadId guardado
   - Captura el response de la respuesta
   - Muestra response al usuario

3. **Fin de conversación:**
   - Opcionalmente llama a deleteThread(threadId)
   - Limpia la variable Flow.threadId

### Variables de Genesys recomendadas:

- Flow.threadId (string) - Almacena el ID del thread
- Flow.assistantId (string) - Almacena el ID del asistente
- Flow.userMessage (string) - Mensaje del usuario
- Flow.assistantResponse (string) - Respuesta del asistente

*/
