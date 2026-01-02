/**
 * AI API configuration
 */
export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

/**
 * Chat message
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * API response
 */
export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  rawResponse?: string;
}

/**
 * Send a chat completion request to the AI API
 * All requests are made directly from the browser (client-side)
 */
export async function sendChatRequest(
  config: ApiConfig,
  messages: ChatMessage[]
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.filter((m) => m.content.trim() !== ''),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        rawResponse: JSON.stringify(data, null, 2),
      };
    }

    return {
      success: true,
      data,
      rawResponse: JSON.stringify(data, null, 2),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Extract the assistant's message from the API response
 */
export function extractAssistantMessage(response: ApiResponse): string {
  if (!response.success || !response.data) {
    return '';
  }

  try {
    return response.data.choices?.[0]?.message?.content || '';
  } catch {
    return '';
  }
}

/**
 * Validate API configuration
 */
export function validateConfig(config: ApiConfig): string | null {
  if (!config.baseUrl.trim()) {
    return 'Base URL is required';
  }

  if (!config.apiKey.trim()) {
    return 'API Key is required';
  }

  if (!config.model.trim()) {
    return 'Model name is required';
  }

  try {
    new URL(config.baseUrl);
  } catch {
    return 'Invalid Base URL format';
  }

  return null;
}
