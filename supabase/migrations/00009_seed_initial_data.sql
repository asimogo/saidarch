-- Default categories
INSERT INTO categories (name_zh, name_en, slug, sort_order) VALUES
  ('别墅', 'Villa', 'villa', 1),
  ('办公', 'Office', 'office', 2),
  ('酒店', 'Hotel', 'hotel', 3),
  ('公寓', 'Apartment', 'apartment', 4);

-- Default translation prompts
INSERT INTO translation_prompts (section_type, prompt_text) VALUES
  ('project', '你是一位资深建筑设计行业翻译专家。请将以下中文内容翻译为英文。要求：使用建筑/室内设计专业术语；语言简洁优雅；保持原文的设计意图和空间描述的准确性。不要添加额外解释。'),
  ('brand', '你是一位高端品牌文案翻译专家。请将以下中文品牌文案翻译为英文。要求：保持品牌调性；适当使用诗意表达；传达东方美学与现代设计的融合感。不要添加额外解释。'),
  ('about', '你是一位专业简历翻译专家。请将以下中文个人/团队介绍翻译为英文。要求：专业简历风格；突出学术背景和专业成就；语言正式但不生硬。不要添加额外解释。'),
  ('contact', '你是一位商务翻译专家。请将以下中文联系信息翻译为英文。要求：商务正式风格；地址按国际惯例格式化。不要添加额外解释。'),
  ('hero', '你是一位品牌文案翻译专家。请将以下中文 Hero 区域文案翻译为英文。要求：精炼有力；品牌宣言感；每句不超过10个英文单词。不要添加额外解释。'),
  ('general', '你是一位中英翻译专家。请将以下中文内容翻译为英文。要求：准确通顺；保持原意；适合网页展示。不要添加额外解释。');

-- Default site settings
INSERT INTO site_settings (key, value_zh, value_en, type, group_name, description, sort_order) VALUES
  ('site_title', 'SAID | 上境设计', 'SAID | Summit Architecture & Interior Design', 'text', 'brand', '网站标题', 1),
  ('site_subtitle', '柬埔寨精英建筑设计团队', 'Elite Architecture Design Team in Cambodia', 'text', 'brand', '网站副标题', 2),
  ('slogan', 'Less is More, but with Local Soul.', 'Less is More, but with Local Soul.', 'text', 'brand', '品牌 Slogan', 3),
  ('logo_light_url', NULL, NULL, 'image', 'brand', '明亮模式 Logo', 4),
  ('logo_dark_url', NULL, NULL, 'image', 'brand', '暗黑模式 Logo', 5),
  ('timezone', 'Asia/Phnom_Penh', 'Asia/Phnom_Penh', 'text', 'theme', '站点时区', 1),
  ('day_start_hour', '6', '6', 'number', 'theme', '日间开始时间', 2),
  ('day_end_hour', '18', '18', 'number', 'theme', '日间结束时间', 3),
  ('telegram_link', NULL, NULL, 'text', 'contact', 'Telegram 链接', 1),
  ('whatsapp_link', NULL, NULL, 'text', 'contact', 'WhatsApp 链接', 2),
  ('email', NULL, NULL, 'text', 'contact', '邮箱地址', 3),
  ('address', NULL, NULL, 'text', 'contact', '办公地址', 4),
  ('google_maps_embed', NULL, NULL, 'text', 'contact', 'Google Maps 嵌入链接', 5),
  ('instagram_url', NULL, NULL, 'text', 'social', 'Instagram', 1),
  ('facebook_url', NULL, NULL, 'text', 'social', 'Facebook', 2),
  ('tiktok_url', NULL, NULL, 'text', 'social', 'TikTok', 3),
  ('seo_title', NULL, NULL, 'text', 'seo', '默认 SEO 标题', 1),
  ('seo_description', NULL, NULL, 'text', 'seo', '默认 SEO 描述', 2),
  ('og_image_url', NULL, NULL, 'image', 'seo', '默认 OG 图片', 3),
  ('avatar_url', NULL, NULL, 'image', 'about', '主创头像', 1),
  ('intro', NULL, NULL, 'text', 'about', '主创介绍', 2),
  ('team_desc', NULL, NULL, 'text', 'about', '团队简述', 3),
  ('services', NULL, NULL, 'text', 'about', '业务范围', 4),
  ('areas', NULL, NULL, 'text', 'about', '服务区域', 5);

-- Default privacy policy page
INSERT INTO page_contents (slug, title_zh, title_en, content_zh, content_en) VALUES
  ('privacy', '隐私政策', 'Privacy Policy', '隐私政策内容待填写...', 'Privacy policy content to be filled...');
