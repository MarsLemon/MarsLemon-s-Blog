export const localEnv = {
  JWT_SECRET:"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",
  DATABASE_URL:"postgres://neondb_owner:npg_S3FPlxKdyQ6j@ep-floral-heart-adkjfqfm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require",

}

export const env =process.env.NODE_ENV === "production"? process.env:localEnv
