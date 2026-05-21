import { createI18n } from "vue-i18n";

const savedLanguage =
  localStorage.getItem("rtpSimulatorLanguage") ||
  localStorage.getItem("language") ||
  "zh";

const messages = {
  en: {
    common: {
      appName: "RTP Simulator",
      appSubtitle: "Spin Wheel Testing Tool",
      login: "Login",
      logout: "Logout",
      username: "Username",
      password: "Password",
      defaultAccount: "Default Account",
      invalidLogin: "Invalid username or password.",
      language: "Language",
      english: "English",
      chinese: "中文",
      help: "Help",
      close: "Close",
      show: "Show",
      hide: "Hide",
      loading: "Loading...",
      rememberMe: "Remember me",
      helpPurpose: "Purpose",
      helpPurposeText:
        "This tool is used to simulate spin wheel RTP, prize weight, payout result and company profit before launching a real campaign.",
      operationSteps: "Operation Steps",
      helpNotes: "Notes",
      helpNote1: "This is a frontend-only simulator.",
      helpNote2: "No backend API or database is required in the first version.",
      helpNote3:
        "Simulation result is used for operation testing and business review.",
    },
    menu: {
      main: "Main",
      configuration: "Configuration",
      testing: "Testing",
      dashboard: "Dashboard",
      prizeConfig: "Prize Configuration",
      simulator: "RTP Simulator",
      resultReport: "Result Report",
      rtpSetting: "RTP Setting",
    },
    login: {
      title: "RTP Simulator",
      subtitle: "Spin Wheel RTP, Weight and Profit Testing Tool",
      usernamePlaceholder: "Enter username",
      passwordPlaceholder: "Enter password",
      introDescription:
        "Internal operation testing tool for configuring spin wheel prize amount, paid spin weight, free spin weight and target kill rate, then calculating the suggested spin cost, expected payout, company profit and campaign risk.",
      feature1:
        "Configure cash / no prize items, prize amount, paid spin weight and free spin weight",
      feature2:
        "Calculate suggested spin cost based on prize weight, target RTP and target kill rate",
      feature3:
        "Allow operation users to enter final spin cost and check actual RTP, actual kill rate, expected payout and company profit",
      feature4:
        "Separate paid spin and free spin mode. Free spin only estimates win rate, expected payout and company cost",
      defaultAccountText: "Default test account for local development:",
      usernamePasswordRequired: "Username and password are required.",
      helpTitle: "Login Page Help",
      helpPurposeText:
        "This page is used by operation users to enter the RTP Simulator testing tool.",
      helpStep1: "Enter username admin.",
      helpStep2: "Enter password admin123.",
      helpStep3: "Click Login to enter the simulator dashboard.",
      helpNote1: "This login is only for local testing.",
      helpNote2: "It is not a production security login.",
      version: "Version",
      rememberMe: "Remember me",
      showPassword: "Show",
      hidePassword: "Hide",
      copyright: "Copyright © 2026 RTP Simulator",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Overview of RTP simulator configuration and testing status.",
      project: "Project",
      currentMode: "Current Mode",
      frontendOnly: "Frontend Only",
      noBackend: "No backend API / No database",
      loginType: "Login Type",
      simpleLogin: "Simple Login",
      noRbac: "No RBAC required",
      status: "Status",
      setup: "M0 Setup",
      setupText: "Base project initialized",
      projectPurpose: "Project Purpose",
      purposeText:
        "This tool helps operation users configure spin wheel prize amount, prize weight, target RTP, spin cost, simulation count, payout result, and company profit before launching a real campaign.",
      nextMilestone: "Next Milestone",
      nextMilestoneText:
        "Next step is M3 — build prize configuration and RTP calculation.",
    },
    prizeConfig: {
      title: "Prize Configuration",
      subtitle:
        "Configure spin wheel prize amount, prize type and winning weight.",
      heading: "Prize Configuration",
      description:
        "This page is used to configure prize name, amount, paid spin weight, free spin weight, no prize weight and active status.",
      placeholder: "M3 Prize Configuration will be built here.",

      basicSetting: "Basic Setting",
      basicSettingDesc:
        "Configure spin count, spin cost, currency, target RTP and current calculation mode.",
      spinCount: "Spin Count",
      spinCost: "Spin Cost",
      currency: "Currency",
      targetRtp: "Target RTP %",
      weightMode: "Weight Mode",
      paidSpin: "Paid Spin",
      freeSpin: "Free Spin",
      saveConfig: "Save Config",
      resetDefault: "Reset Default",

      calculationSummary: "Calculation Summary",
      calculationSummaryDesc:
        "Preview theoretical RTP, expected payout, total investment and company profit.",
      totalWeight: "Total Weight",
      averagePayout: "Average Payout / Spin",
      totalInvestment: "Total Investment",
      totalPayout: "Total Payout",
      profitRate: "Profit Rate",
      theoreticalRtp: "Theoretical RTP",
      companyProfit: "Company Profit",
      winRate: "Win Rate",
      noPrizeRate: "No Prize Rate",

      prizeList: "Prize List",
      prizeListDesc:
        "Weight is not equal to probability. Probability is calculated by prize weight divided by total weight.",
      addPrize: "Add Prize",
      prizeName: "Prize Name",
      prizeType: "Prize Type",
      amount: "Amount",
      paidWeight: "Paid Weight",
      freeWeight: "Free Weight",
      currentProbability: "Probability",
      expectedHitCount: "Expected Hit Count",
      expectedPayout: "Expected Payout",
      rtpContribution: "RTP Contribution",
      active: "Active",
      action: "Action",
      cash: "Cash",
      freeSpinPrize: "Free Spin",
      noPrize: "No Prize",
      enabled: "Enabled",
      disabled: "Disabled",
      delete: "Delete",
      newPrize: "New Prize",

      saveSuccess: "Configuration saved successfully.",
      resetSuccess: "Default configuration restored.",
      lossWarning:
        "Current configuration is expected to lose money in the long run. Please increase spin cost, reduce high prize weight, or increase no prize weight.",
      highRtpWarning:
        "Current RTP is higher than 95%. Company profit margin may be too low.",

      currentUsingPaidWeight:
        "Current calculation is using Paid Weight. Changing Free Weight will not affect this preview until you switch to Free Spin mode.",
      currentUsingFreeWeight:
        "Current calculation is using Free Weight. Changing Paid Weight will not affect this preview until you switch to Paid Spin mode.",

      operationPricingSetting: "Operation Pricing Setting",
      operationPricingSettingDesc:
        "Configure target kill rate, RTP and prize weight. The system will suggest how much to charge per spin.",
      calculationMode: "Calculation Mode",
      suggestPriceMode: "Suggest Spin Cost",
      manualCheckMode: "Manual Spin Cost Check",
      suggestPriceModeNote:
        "Main operation mode: the system calculates the suggested spin cost based on prize amount, weight and target kill rate.",
      manualCheckModeNote:
        "Manual check mode: operation enters a spin cost manually, and the system checks actual RTP, kill rate and company profit.",
      targetKillRate: "Target Kill Rate %",
      actualKillRate: "Actual Kill Rate",
      actualRtp: "Actual RTP",
      suggestedSpinCost: "Suggested Spin Cost",
      manualSpinCost: "Manual Spin Cost",
      effectiveSpinCost: "Effective Spin Cost",
      finalSpinCost: "Final Spin Cost",

      keyResult: "Key Result",
      keyResultDesc:
        "Main operation result based on suggested spin cost, final spin cost, actual kill rate and company profit.",
      weightAndProbability: "Weight & Probability",
      investmentAndPayout: "Investment & Payout",
      rtpAndKillRate: "RTP & Kill Rate",
      rtpSettingTitle: "RTP Setting",
      rtpSettingDesc:
        "Configure target RTP, kill rate, spin cost, prize amount and paid / free spin weight.",
      prizeWeightSetting: "Prize & Weight Setting",
      saveChanges: "Save Changes",
      unsavedChanges:
        "Configuration changed. Please click Save Changes to keep your changes.",
      detailedAnalysis: "Detailed Analysis",
      analysisResult: "Analysis Result",

      moveTop: "Move to Top",
      moveUp: "Move Up",
      moveDown: "Move Down",

      freeSpinModeNote:
        "Free Spin Mode: The system only uses Free Spin Weight to calculate win rate and expected payout. Free Spin does not calculate spin cost, RTP, kill rate or company profit.",
      currentUsingFreeWeightNoCost:
        "Current mode is Free Spin. The system only uses Free Spin Weight to calculate win rate and expected payout. Free Spin does not calculate spin cost.",
      freeSpinKeyResultDesc:
        "Free Spin has no player payment. The system only estimates payout, win rate and company cost.",
      freeSpinAnalysisDesc:
        "Free Spin Mode only analyzes win rate, expected payout and estimated company cost. It does not calculate RTP, kill rate or profit.",
      companyEstimatedCost: "Estimated Company Cost",
      costAndPayout: "Cost & Payout",
      freeSpinSummary: "Free Spin Summary",
      freeSpinCost: "Free Spin Cost",
      freeSpinNoRtpNote: "Free Spin does not calculate RTP / Kill Rate",
      costContribution: "Cost Contribution",
      downloadPdf: "Download PDF",
      downloadingPdf: "Generating PDF...",
      pdfReportTitle: "RTP Configuration Report",
      pdfBasicConfig: "Basic Configuration",
      pdfAnalysisResult: "Analysis Result",
      pdfPrizeDetail: "Prize Detail",
      pdfGeneratedAt: "Generated At",
      pdfDownloadSuccess: "PDF report downloaded successfully.",
      pdfDownloadFailed: "Failed to generate PDF report.",
    },
    simulator: {
      title: "RTP Simulator",
      subtitle: "Run single spin, step-by-step spin, or fast bulk simulation.",
      heading: "RTP Simulator",
      description:
        "This page will simulate actual spin results based on configured prize weight.",
      placeholder: "M5 / M6 Simulation Engine will be built here.",
    },
    resultReport: {
      title: "Result Report",
      subtitle: "Review simulation result and download report.",
      heading: "Result Report",
      description:
        "This page will show total spins, total investment, total payout, actual RTP, win rate, company profit and export result.",
      placeholder: "M7 / M8 Result Report and Export will be built here.",
    },
  },

  zh: {
    common: {
      appName: "杀率模拟器",
      appSubtitle: "转盘杀率测试工具",
      login: "登录",
      logout: "退出",
      username: "用户名",
      password: "密码",
      defaultAccount: "默认账号",
      invalidLogin: "用户名或密码错误",
      language: "语言",
      english: "English",
      chinese: "中文",
      help: "帮助",
      close: "关闭",
      show: "显示",
      hide: "隐藏",
      loading: "加载中...",
      rememberMe: "记住我",
      helpPurpose: "用途",
      helpPurposeText:
        "这个工具用于在正式上线转盘活动前，模拟 RTP、奖品权重、派彩结果和公司盈利",
      operationSteps: "操作步骤",
      helpNotes: "注意事项",
      helpNote1: "这是一个纯前端模拟工具",
      helpNote2: "第一版不需要后端 API 或数据库",
      helpNote3: "测试结果用于运营调试和业务审批",
    },
    menu: {
      main: "主要功能",
      configuration: "配置管理",
      testing: "模拟测试",
      dashboard: "仪表盘",
      prizeConfig: "杀率配置",
      simulator: "RTP 模拟器",
      resultReport: "测试报表",
      rtpSetting: "杀率配置",
    },
    login: {
      title: "RTP 模拟器",
      subtitle: "转盘 RTP、权重、中奖率与公司盈利测试工具",
      usernamePlaceholder: "请输入用户名",
      passwordPlaceholder: "请输入密码",
      introDescription:
        "内部运营测试工具，用于配置转盘奖品金额、付费转权重、免费转权重和目标杀率，并反推建议每次收费，协助运营评估预计派彩、公司盈利和活动风险",
      feature1: "配置奖金 / 未中奖奖品、奖品金额、付费转权重和免费转权重",
      feature2: "根据奖品权重和目标 RTP / 目标杀率，自动反推建议每次收费",
      feature3:
        "支持运营填写实际采用收费，检查实际 RTP、实际杀率、预计派彩和公司盈利",
      feature4:
        "区分付费转和免费转模式，免费转只评估中奖率、预计派彩和公司成本",
      defaultAccountText: "本地测试默认账号：",
      usernamePasswordRequired: "请输入用户名和密码",
      helpTitle: "登录页帮助",
      helpPurposeText: "这个页面用于让运营人员进入 RTP Simulator 测试工具",
      helpStep1: "输入用户名 admin",
      helpStep2: "输入密码 admin123",
      helpStep3: "点击登录进入模拟器仪表盘",
      helpNote1: "这个登录只用于本地测试",
      helpNote2: "这不是正式生产环境安全登录",
      version: "版本",
      rememberMe: "记住我",
      showPassword: "显示",
      hidePassword: "隐藏",
      copyright: "版权所有 © 2026 杀率模拟器",
    },
    dashboard: {
      title: "仪表盘",
      subtitle: "查看 RTP 模拟器配置与测试状态",
      project: "项目",
      currentMode: "当前模式",
      frontendOnly: "纯前端",
      noBackend: "没有后端 API / 没有数据库",
      loginType: "登录类型",
      simpleLogin: "简单登录",
      noRbac: "不需要 RBAC 权限",
      status: "状态",
      setup: "M0 初始化",
      setupText: "基础项目已初始化",
      projectPurpose: "项目用途",
      purposeText:
        "这个工具用于帮助运营在正式上线转盘活动前，先配置奖品金额、奖品权重、目标 RTP、每次收费、模拟转盘次数、预计派彩结果和公司盈利",
      nextMilestone: "下一阶段",
      nextMilestoneText: "下一步是 M3 — 完成奖品配置和 RTP 计算",
    },
    prizeConfig: {
      title: "奖品配置",
      subtitle: "配置转盘奖品金额、奖品类型和中奖权重",
      heading: "奖品配置",
      description:
        "这个页面用于配置奖品名称、金额、付费转权重、免费转权重、未中奖权重和启用状态",
      placeholder: "M3 奖品配置会在这里开发",

      basicSetting: "基础设置",
      basicSettingDesc:
        "配置模拟转盘次数、每次收费、币种、目标 RTP 和当前计算模式",
      spinCount: "转盘次数",
      spinCost: "每次收费",
      currency: "币种",
      targetRtp: "目标 RTP %",
      weightMode: "权重模式",
      paidSpin: "付费转",
      freeSpin: "免费转",
      saveConfig: "保存配置",
      resetDefault: "恢复默认",

      calculationSummary: "计算汇总",
      calculationSummaryDesc: "预览理论 RTP、预计派彩、总投入和公司盈利",
      totalWeight: "总权重",
      averagePayout: "每次平均派彩",
      totalInvestment: "总投入",
      totalPayout: "总派彩",
      profitRate: "盈利率",
      theoreticalRtp: "理论 RTP",
      companyProfit: "公司盈利",
      winRate: "中奖率",
      noPrizeRate: "未中奖率",

      prizeList: "奖品列表",
      prizeListDesc:
        "权重不等于中奖率，中奖率是当前奖品权重除以总权重后计算出来",
      addPrize: "新增奖品",
      prizeName: "奖品名称",
      prizeType: "奖品类型",
      amount: "金额",
      paidWeight: "付费转权重",
      freeWeight: "免费转权重",
      currentProbability: "中奖概率",
      expectedHitCount: "预计中奖次数",
      expectedPayout: "预计派彩",
      rtpContribution: "RTP 贡献",
      active: "启用",
      action: "操作",
      cash: "奖金",
      freeSpinPrize: "免费转",
      noPrize: "未中奖",
      enabled: "启用",
      disabled: "停用",
      delete: "删除",
      newPrize: "新奖品",

      saveSuccess: "配置已保存",
      resetSuccess: "已恢复默认配置",
      lossWarning:
        "当前配置长期预期会亏损，请提高每次收费、降低高金额奖品权重，或提高未中奖权重",
      highRtpWarning: "当前 RTP 高于 95%，公司盈利空间可能过低",

      currentUsingPaidWeight:
        "当前计算使用的是付费转权重。修改免费转权重不会影响当前预览，除非切换到免费转模式",
      currentUsingFreeWeight:
        "当前计算使用的是免费转权重。修改付费转权重不会影响当前预览，除非切换到付费转模式",

      operationPricingSetting: "运营定价设置",
      operationPricingSettingDesc:
        "配置目标杀率、RTP 和奖品权重，系统会自动反推每次应该收费多少",
      calculationMode: "计算模式",
      suggestPriceMode: "自动建议收费",
      manualCheckMode: "手动检查收费",
      suggestPriceModeNote:
        "运营主模式：系统会根据奖品金额、权重和目标杀率，自动计算建议每次收费",
      manualCheckModeNote:
        "手动检查模式：运营手动输入每次收费，系统检查实际 RTP、实际杀率和公司盈利",
      targetKillRate: "目标杀率 %",
      actualKillRate: "实际杀率",
      actualRtp: "实际 RTP",
      suggestedSpinCost: "建议每次收费",
      manualSpinCost: "手动每次收费",
      effectiveSpinCost: "当前计算收费",
      finalSpinCost: "实际采用收费",

      keyResult: "关键结果",
      keyResultDesc:
        "根据建议收费、实际采用收费、实际杀率和公司盈利显示核心运营结果",
      weightAndProbability: "权重与中奖率",
      investmentAndPayout: "投入与派彩",
      rtpAndKillRate: "RTP 与杀率",
      rtpSettingTitle: "杀率配置",
      rtpSettingDesc:
        "配置目标 RTP、杀率、每次收费、奖品金额和付费转 / 免费转权重",
      prizeWeightSetting: "奖品与权重配置",
      saveChanges: "保存修改",
      unsavedChanges: "配置已修改，请点击「保存修改」才会保留",
      detailedAnalysis: "详细分析",
      analysisResult: "分析结果",

      moveTop: "置顶",
      moveUp: "上移",
      moveDown: "下移",

      freeSpinModeNote:
        "免费转模式：系统只使用免费转权重计算中奖率和预计派彩；免费转不计算每次收费、RTP、杀率和公司盈利",
      currentUsingFreeWeightNoCost:
        "当前为免费转模式，系统只使用免费转权重计算中奖率和预计派彩；免费转不计算收费",
      freeSpinKeyResultDesc:
        "免费转没有玩家付费，系统只预估派彩、中奖率和公司成本",
      freeSpinAnalysisDesc:
        "免费转模式只分析中奖率、预计派彩和公司预计成本，不计算 RTP、杀率和盈利",
      companyEstimatedCost: "公司预计成本",
      costAndPayout: "成本与派彩",
      freeSpinSummary: "免费转摘要",
      freeSpinCost: "免费转收费",
      freeSpinNoRtpNote: "免费转不计算 RTP / 杀率",
      costContribution: "成本占比",
      downloadPdf: "下载 PDF",
      downloadingPdf: "正在生成 PDF...",
      pdfReportTitle: "杀率配置报告",
      pdfBasicConfig: "基础配置",
      pdfAnalysisResult: "分析结果",
      pdfPrizeDetail: "奖品明细",
      pdfGeneratedAt: "生成时间",
      pdfDownloadSuccess: "PDF 报告已下载",
      pdfDownloadFailed: "PDF 报告生成失败",
    },
    simulator: {
      title: "RTP 模拟器",
      subtitle: "执行单次转动、逐次转动或快速批量模拟",
      heading: "RTP 模拟器",
      description: "这个页面会根据配置好的奖品权重，模拟真实转盘中奖结果",
      placeholder: "M5 / M6 转盘模拟引擎会在这里开发",
    },
    resultReport: {
      title: "测试报表",
      subtitle: "查看模拟测试结果并下载报表",
      heading: "测试报表",
      description:
        "这个页面会显示总转盘次数、总投入、总派彩、实际 RTP、中奖率、公司盈利和导出结果",
      placeholder: "M7 / M8 测试报表和下载功能会在这里开发",
    },
  },
};

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: "zh",
  messages,
});

export default i18n;
