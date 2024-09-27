import i18next from 'i18next'
import { useSettings } from '../store/settings'
import * as BedrockRuntime from '@aws-sdk/client-bedrock-runtime'

export const useBedrockAPI = () => {
  const { settings } = useSettings()

  const sendMessage = async (
    prompt: string,
    onData: (text: string, error?: Error, end?: boolean) => void
  ) => {
    const abortController = new AbortController()
    console.log('sendMessage', prompt)
    try {
      if (
        !settings.bedrockAccessKey ||
        !settings.bedrockSecretKey ||
        !settings.bedrockRegion ||
        !settings.bedrockModel
      ) {
        throw new Error(
          i18next.t(
            'Bedrock settings are incomplete. Please check your configuration.'
          )
        )
      }

      const client = new BedrockRuntime.BedrockRuntimeClient({
        region: settings.bedrockRegion,
        credentials: {
          accessKeyId: settings.bedrockAccessKey,
          secretAccessKey: settings.bedrockSecretKey,
        },
      })

      const payload = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: prompt }],
          },
        ],
      }

      const command = new BedrockRuntime.InvokeModelWithResponseStreamCommand({
        contentType: 'application/json',
        body: JSON.stringify(payload),
        modelId: settings.bedrockModel,
      })

      const apiResponse = await client.send(command)

      for await (const chunk of apiResponse.body) {
        const parsedChunk = JSON.parse(
          new TextDecoder().decode(chunk.chunk.bytes)
        )
        if (parsedChunk.type === 'content_block_delta') {
          onData(parsedChunk.delta.text, null, false)
        }
      }

      onData('', null, true)
    } catch (error) {
      onData('', error, true)
    }

    return () => {
      abortController.abort()
    }
  }

  return { sendMessage }
}

export const invokeBedrock = async (prompt: string, settings: any) => {
  const client = new BedrockRuntime.BedrockRuntimeClient({
    region: settings.bedrockRegion,
    credentials: {
      accessKeyId: settings.bedrockAccessKey,
      secretAccessKey: settings.bedrockSecretKey,
    },
  })

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: prompt }],
      },
    ],
  }

  const command = new BedrockRuntime.InvokeModelCommand({
    contentType: 'application/json',
    body: JSON.stringify(payload),
    modelId: settings.bedrockModel,
  })
  console.log('client.send(command)', command)

  const apiResponse = await client.send(command)
  const decodedResponseBody = new TextDecoder().decode(apiResponse.body)
  const responseBody = JSON.parse(decodedResponseBody)
  return responseBody.content[0].text
}
