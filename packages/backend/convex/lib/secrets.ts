import {
  CreateSecretCommand,
  GetSecretValueCommand,
  type GetRandomPasswordCommandOutput,
  PutSecretValueCommand,
  ResourceExistsException,
  SecretsManagerClient,
  type GetSecretValueCommandOutput,
} from "@aws-sdk/client-secrets-manager"

export function createSecretManagerCleint(): SecretsManagerClient {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  console.log(accessKeyId, secretAccessKey, "AWS credentials loaded")
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS credentials are not configured")
  }
  return new SecretsManagerClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  })
}
export async function getSecretValue(
  secretName: string
): Promise<GetSecretValueCommandOutput> {
  const client = createSecretManagerCleint()
  const command = new GetSecretValueCommand({ SecretId: secretName })
  return client.send(command)
}
export async function upsertSecret(
  secretName: string,
  secretValue: Record<string, unknown>
): Promise<void> {
  const client = createSecretManagerCleint()
  console.log("Upserting secret with name:", secretName)
  try {
    const command = new CreateSecretCommand({
      Name: secretName,
      SecretString: JSON.stringify(secretValue),
    })

    await client.send(command)
    console.log("Secret created successfully with name:", secretName)
  } catch (error) {
    if (error instanceof ResourceExistsException) {
      const command = new PutSecretValueCommand({
        SecretId: secretName,
        SecretString: JSON.stringify(secretValue),
      })
      await client.send(command)
    } else {
      throw error
    }
  }
}

export function parseSecretString<T = Record<string, unknown>>(
  secret: GetSecretValueCommandOutput
): T | null {
  if (!secret.SecretString) {
    return null
  }
  try {
    return JSON.parse(secret.SecretString) as T
  } catch (error) {
    return null
  }
}
