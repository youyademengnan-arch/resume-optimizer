export default function ResumeInput({ value, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
      <label className="text-sm font-semibold text-slate-700 mb-2">
        我的简历
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="粘贴你的简历内容...

示例格式：
张三
手机：138xxxx | 邮箱：zhang@example.com

教育经历
2019-2023 北京大学 计算机科学 本科

工作经历
2023-至今 XX公司 前端开发工程师
- 负责公司核心产品的前端架构设计
- 使用 React + TypeScript 重构了旧系统"
        className="flex-1 min-h-[320px] p-4 border border-slate-200 rounded-lg resize-y text-sm leading-relaxed
                   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                   placeholder:text-slate-400"
      />
      <div className="mt-2 text-xs text-slate-400 text-right">
        {value.length} 字
      </div>
    </div>
  )
}
