import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

let r2: S3Client | null = null

export const useR2Client = () => {
  if (r2) return r2

  const config = useRuntimeConfig()
  r2 = new S3Client({
    region: 'auto',
    endpoint: config.r2Endpoint,
    credentials: {
      accessKeyId: config.r2AccessKeyId,
      secretAccessKey: config.r2SecretAccessKey,
    },
  })
  return r2
}

export const generatePresignedUrl = async (key: string, contentType: string) => {
  const config = useRuntimeConfig()
  const client = useR2Client()
  const command = new PutObjectCommand({
    Bucket: config.r2BucketName,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(client, command, { expiresIn: 600 })
}
