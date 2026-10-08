// Allows the permitted fields at their limits when encoded as UTF-8.
export const inquiryBodyByteLimit = 32_000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const limits = { name: 100, company: 150, email: 180, country: 100, product: 160, model: 50, quantity: 50, message: 4000, projectType: 30, stage: 30, referenceUrl: 1000, targetWindow: 120 };

export function validateInquiry(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { values: {}, errors: { form: 'Invalid request.' } };
  const values = Object.fromEntries(Object.keys(limits).map((key) => [key, typeof input[key] === 'string' ? input[key].trim() : '']));
  values.sourcePage = typeof input.sourcePage === 'string' && /^\/[a-z0-9/\-]*$/i.test(input.sourcePage) && input.sourcePage.length <= 200 ? input.sourcePage : '/contact';
  values.language = input.language === 'zh' ? 'zh' : 'en';
  const zh = values.language === 'zh';
  values.consent = input.consent === true;
  const errors = {};
  for (const key of ['name', 'company', 'email', 'country', 'product', 'message']) {
    if (!values[key]) errors[key] = zh ? '请填写此项。' : 'Please complete this field.';
  }
  for (const [key, limit] of Object.entries(limits)) {
    if (values[key].length > limit) errors[key] = zh ? `请勿超过 ${limit} 个字符。` : `Please use ${limit} characters or fewer.`;
  }
  if (values.email && !emailPattern.test(values.email)) errors.email = zh ? '请输入有效的电子邮箱。' : 'Enter a valid email address.';
  if (values.message && values.message.length < 10) errors.message = zh ? '请至少填写 10 个字符，说明您的项目需求。' : 'Please add at least 10 characters about your project.';
  if (values.model && !/^[a-z0-9-]+$/i.test(values.model)) errors.model = zh ? '产品型号无效。' : 'Invalid model code.';
  if (values.projectType && !['reference', 'custom', 'both'].includes(values.projectType)) errors.projectType = zh ? '请选择采购方式。' : 'Choose a sourcing route.';
  if (values.stage && !['exploring', 'brief', 'sample', 'order'].includes(values.stage)) errors.stage = zh ? '请选择项目阶段。' : 'Choose a project stage.';
  if (values.referenceUrl) {
    try {
      const url = new URL(values.referenceUrl);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid reference');
    } catch { errors.referenceUrl = zh ? '请使用不含登录信息的公开 http 或 https 链接。' : 'Use a public http or https link without sign-in details.'; }
  }
  if (!values.consent) errors.consent = zh ? '请先同意联系授权后再继续。' : 'Please agree before continuing.';
  return { values, errors };
}
