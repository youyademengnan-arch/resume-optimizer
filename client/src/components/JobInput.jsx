const INDUSTRIES = [
  '互联网/IT',
  '金融',
  '教育',
  '医疗',
  '制造业',
  '快消/零售',
  '房地产',
  '咨询',
  '媒体/广告',
  '其他'
]

export default function JobInput({ value, onChange, industry, onIndustryChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
      <label className="text-sm font-semibold text-slate-700 mb-2">
        目标职位描述 (JD)
      </label>
      <div className="mb-3">
        <select
          value={industry}
          onChange={(e) => onIndustryChange(e.target.value)}
          className="w-full p-2 border border-slate-200 rounded-lg text-sm text-slate-600
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        >
          <option value="">选择行业（可选）</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="粘贴目标职位的 JD...

示例：
岗位职责：
1. 负责Web前端产品的设计与开发
2. 与产品、后端协作完成需求迭代
3. 持续优化前端性能和用户体验

任职要求：
1. 3年以上前端开发经验
2. 精通 React、TypeScript
3. 有大型项目架构经验优先"
        className="flex-1 min-h-[280px] p-4 border border-slate-200 rounded-lg resize-y text-sm leading-relaxed
                   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                   placeholder:text-slate-400"
      />
      <div className="mt-2 text-xs text-slate-400 text-right">
        {value.length} 字
      </div>
    </div>
  )
}
