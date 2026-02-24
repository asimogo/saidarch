export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const { texts, sectionType } = await readBody(event)
  const config = useRuntimeConfig()

  if (!config.deepseekApiKey) {
    throw createError({ statusCode: 500, message: 'DeepSeek API key not configured' })
  }

  if (!Array.isArray(texts) || !texts.length || texts.length > 30) {
    throw createError({ statusCode: 400, message: 'Invalid texts payload' })
  }

  if (!sectionType || typeof sectionType !== 'string') {
    throw createError({ statusCode: 400, message: 'Invalid sectionType' })
  }

  // Get prompt from translation_prompts table
  const supabase = useSupabaseAdmin()
  const { data: prompt } = await supabase
    .from('translation_prompts')
    .select('prompt_text')
    .eq('section_type', sectionType)
    .single()

  const systemPrompt = prompt?.prompt_text || '请将以下中文翻译为英文。'

  const validTexts = texts.filter((t: unknown): t is { field: string; content: string } => {
    return !!t
      && typeof t === 'object'
      && 'field' in t
      && 'content' in t
      && typeof (t as { field: unknown }).field === 'string'
      && typeof (t as { content: unknown }).content === 'string'
      && (t as { field: string }).field.trim().length > 0
      && (t as { content: string }).content.trim().length > 0
  })

  if (!validTexts.length) {
    throw createError({ statusCode: 400, message: 'No translatable text' })
  }

  const userContent = validTexts
    .map((t) => `[${t.field}]\n${t.content}`)
    .join('\n\n---\n\n')

  const response: any = await $fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.deepseekApiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请翻译以下中文内容为英文，保持 [字段名] 标记不变：\n\n${userContent}` },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    },
  })

  const translatedText = response?.choices?.[0]?.message?.content
  if (!translatedText || typeof translatedText !== 'string') {
    throw createError({ statusCode: 502, message: 'Invalid translation response' })
  }
  const results: Record<string, string> = {}
  const regex = /\[([^\]]+)\]\n([\s\S]*?)(?=\n---\n|\n\[|$)/g
  let m
  while ((m = regex.exec(translatedText)) !== null) {
    results[m[1].trim()] = m[2].trim()
  }

  return { translations: results }
})
