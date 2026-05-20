export const prizeConfigHelp = {
  en: {
    title: "RTP Setting User Guide",

    purposeTitle: "Purpose",
    purposeText:
      "The RTP Simulator helps operation users configure prize amount, prize weight, target RTP, target kill rate and final spin cost before launching a spin wheel campaign. It estimates win rate, payout, company profit and actual kill rate. This tool is only for internal simulation and configuration review. It does not connect to the real member system, deposit system or payout system.",

    stepTitle: "Operation Steps",
    conceptTitle: "Relationship Between Weight and RTP",

    conceptText:
      "Weight and RTP are different concepts. They do not conflict with each other. Weight determines prize probability and average payout per spin. RTP is used to calculate the suggested spin cost based on the average payout.",

    conceptItems: [
      {
        title: "1. Weight determines win probability",
        text: "The system calculates each prize probability based on the selected weight mode. Prize probability = current prize weight / total weight of the selected mode.",
      },
      {
        title: "2. Weight affects average payout",
        text: "If a prize has a higher amount and higher weight, the average payout per spin will increase. When average payout increases, the suggested spin cost will also increase.",
      },
      {
        title: "3. Target RTP is used to calculate suggested spin cost",
        text: "Target RTP does not directly change win probability. It is used to calculate the suggested spin cost. Suggested Spin Cost = Average Payout per Spin / Target RTP.",
      },
      {
        title: "4. Final spin cost affects actual RTP",
        text: "If the final spin cost is higher than the suggested spin cost, actual RTP will decrease and actual kill rate will increase. If the final spin cost is lower than the suggested spin cost, actual RTP will increase and company profit margin will decrease.",
      },
      {
        title: "5. Target RTP and actual RTP can be different",
        text: "Target RTP is used to calculate the suggested spin cost. Actual RTP is recalculated based on the final spin cost entered by operation users. Therefore, different target RTP and actual RTP does not mean the calculation is wrong.",
      },
      {
        title: "6. Free Spin does not calculate RTP or kill rate",
        text: "Free Spin has no player payment, so it does not calculate suggested spin cost, final spin cost, RTP, kill rate or company profit. Free Spin only calculates win rate, expected payout and estimated company cost.",
      },
    ],
    steps: [
      {
        title: "1. Set Basic Configuration",
        text: "Select calculation mode, weight mode, spin count and currency. Weight mode includes Paid Spin and Free Spin. The system will calculate based on the selected weight mode.",
      },
      {
        title: "2. Set Target RTP or Target Kill Rate",
        text: "Operation users can enter Target RTP, and the system will calculate Target Kill Rate automatically. Users can also enter Target Kill Rate, and the system will calculate Target RTP automatically. Target Kill Rate = 100% - Target RTP.",
      },
      {
        title: "3. Check Suggested Spin Cost",
        text: "The system calculates the suggested spin cost based on prize amount, current weight mode and target RTP. Suggested spin cost is only a reference value and does not have to be used as the final price.",
      },
      {
        title: "4. Enter Final Spin Cost",
        text: "Operation users can enter the final spin cost based on business needs. The system will use the final spin cost to calculate total investment, actual RTP, actual kill rate and company profit. If final spin cost is empty or 0, the system will use the suggested spin cost by default.",
      },
      {
        title: "5. Configure Prize and Weight",
        text: "In Prize & Weight Setting, users can maintain prize name, prize type, amount, paid spin weight, free spin weight and active status. Prize type only includes Cash and No Prize. Free Spin is not a prize type.",
      },
      {
        title: "6. Review Key Result",
        text: "Key Result shows suggested spin cost, final spin cost, effective spin cost, actual kill rate and company profit. Operation users should check this section first to quickly understand whether the current configuration is reasonable.",
      },
      {
        title: "7. Review Detailed Analysis",
        text: "Detailed Analysis shows weight and probability, investment and payout, RTP and kill rate. It is used to further verify whether the configuration matches the expected business target.",
      },
      {
        title: "8. Save Configuration",
        text: "After changing basic configuration, prize amount, weight or active status, users must click Save Config to keep the changes. The current version does not connect to a database. Configuration is saved only in the current browser localStorage.",
      },
    ],

    formulaTitle: "Main Formulas",
    formulas: [
      "Average Payout per Spin = Weighted average of prize amount and current mode weight",
      "Suggested Spin Cost = Average Payout per Spin / Target RTP",
      "Target Kill Rate = 100% - Target RTP",
      "Total Investment = Spin Count × Effective Spin Cost",
      "Total Payout = Spin Count × Average Payout per Spin",
      "Actual RTP = Total Payout / Total Investment",
      "Actual Kill Rate = 100% - Actual RTP",
      "Company Profit = Total Investment - Total Payout",
    ],

    noticeTitle: "Notes",
    notices: [
      "Weight is not the same as win rate. Win rate is calculated by dividing the current prize weight by the total weight of the selected mode.",
      "Paid Spin and Free Spin use two different weight sets. When switching mode, the system recalculates using the selected mode weight.",
      "No Prize amount is fixed as 0 and does not generate payout.",
      "If actual RTP is too high, company profit margin will be lower. If company profit is negative, the current configuration is expected to lose money in the long run.",
      "The current version is a frontend-only simulator. It does not connect to backend API, database, real deduction or real payout.",
    ],
  },

  zh: {
    title: "杀率配置操作手册",

    purposeTitle: "功能用途",
    purposeText:
      "杀率模拟器用于帮助运营在正式上线转盘活动前，先配置奖品金额、奖品权重、目标 RTP、目标杀率和实际采用收费，并预估中奖率、派彩、公司盈利和实际杀率。此工具只用于内部模拟和配置参考，不会连接正式会员系统、充值系统或派彩系统。",

    stepTitle: "操作步骤",
    conceptTitle: "权重与 RTP 的关系",

    conceptText:
      "权重和 RTP 不是同一个概念，也不是互相冲突。权重负责决定每个奖品的中奖概率和每次平均派彩；RTP 负责根据每次平均派彩反推建议每次收费。",

    conceptItems: [
      {
        title: "1. 权重决定中奖概率",
        text: "系统会根据当前模式的总权重计算每个奖品的中奖概率。中奖概率 = 当前奖品权重 / 当前模式总权重。",
      },
      {
        title: "2. 权重会影响每次平均派彩",
        text: "奖品金额越高、权重越大，每次平均派彩就越高。每次平均派彩越高，系统反推出来的建议每次收费也会越高。",
      },
      {
        title: "3. 目标 RTP 用来反推建议收费",
        text: "目标 RTP 不是直接改变中奖率，而是用来计算建议每次收费。建议每次收费 = 每次平均派彩 / 目标 RTP。",
      },
      {
        title: "4. 实际采用收费会影响实际 RTP",
        text: "如果运营填写的实际采用收费高于建议收费，实际 RTP 会降低，实际杀率会提高；如果实际采用收费低于建议收费，实际 RTP 会提高，公司盈利空间会降低。",
      },
      {
        title: "5. 目标 RTP 和实际 RTP 可以不同",
        text: "目标 RTP 是系统反推建议收费时使用的目标值；实际 RTP 是根据运营最终采用的收费重新计算出来的结果。因此两者不同并不代表计算错误。",
      },
      {
        title: "6. 免费转不计算 RTP 和杀率",
        text: "免费转没有玩家付费，因此不计算建议收费、实际收费、RTP、杀率和公司盈利。免费转只计算中奖率、预计派彩和公司预计成本。",
      },
    ],
    steps: [
      {
        title: "1. 设置基础配置",
        text: "选择计算模式、权重模式、转盘次数和币种。权重模式分为付费转和免费转，系统会根据当前选择的模式读取对应的权重进行计算。",
      },
      {
        title: "2. 设置目标 RTP 或目标杀率",
        text: "运营可以输入目标 RTP，系统会自动反推目标杀率；也可以输入目标杀率，系统会自动反推目标 RTP。目标杀率 = 100% - 目标 RTP。",
      },
      {
        title: "3. 查看建议每次收费",
        text: "系统会根据奖品金额、当前权重模式和目标 RTP 自动计算建议每次收费。建议每次收费只是参考值，不代表最终一定要采用。",
      },
      {
        title: "4. 输入实际采用收费",
        text: "运营可以根据业务需要输入实际采用收费。系统会优先使用实际采用收费计算总投入、实际 RTP、实际杀率和公司盈利。如果实际采用收费为空或为 0，系统会默认使用建议每次收费。",
      },
      {
        title: "5. 配置奖品与权重",
        text: "在奖品与权重配置中，可以维护奖品名称、奖品类型、金额、付费转权重、免费转权重和启用状态。奖品类型只有奖金和未中奖，免费转不是奖品类型。",
      },
      {
        title: "6. 查看关键结果",
        text: "关键结果会显示建议每次收费、实际采用收费、当前计算收费、实际杀率和公司盈利。运营可以优先查看这一块，快速判断当前配置是否合理。",
      },
      {
        title: "7. 查看详细分析",
        text: "详细分析会显示权重与中奖率、投入与派彩、RTP 与杀率等数据，用于进一步检查配置是否符合预期。",
      },
      {
        title: "8. 保存配置",
        text: "修改基础配置、奖品金额、权重或启用状态后，需要点击保存配置才会保留。当前版本不会连接数据库，配置只会保存到当前浏览器的 localStorage。",
      },
    ],

    formulaTitle: "主要计算公式",
    formulas: [
      "每次平均派彩 = 奖品金额 × 当前模式权重的加权平均值",
      "建议每次收费 = 每次平均派彩 / 目标 RTP",
      "目标杀率 = 100% - 目标 RTP",
      "总投入 = 转盘次数 × 当前计算收费",
      "总派彩 = 转盘次数 × 每次平均派彩",
      "实际 RTP = 总派彩 / 总投入",
      "实际杀率 = 100% - 实际 RTP",
      "公司盈利 = 总投入 - 总派彩",
    ],

    noticeTitle: "注意事项",
    notices: [
      "权重不是中奖率，中奖率是当前奖品权重除以当前模式总权重后计算出来的结果。",
      "付费转和免费转是两套不同权重，切换模式后系统会使用对应模式的权重重新计算。",
      "未中奖的金额固定为 0，不会产生派彩。",
      "如果实际 RTP 太高，公司盈利空间会变低；如果公司盈利为负数，代表当前配置长期预期会亏损。",
      "当前版本是纯前端模拟工具，不接后端 API、不接数据库、不做真实扣款或真实派彩。",
    ],
  },
};
