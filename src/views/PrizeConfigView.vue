<template>
  <AppLayout :title="t('prizeConfig.title')" :subtitle="t('prizeConfig.subtitle')">
    <!-- =========================================================
      1. RTP Setting - Config + Prize Table
      ========================================================= -->
    <div class="admin-card rtp-setting-card">
      <div class="admin-page-header prize-config-header rtp-setting-header">
        <div>
          <h1>{{ t('prizeConfig.rtpSettingTitle') }}</h1>
          <p>{{ t('prizeConfig.rtpSettingDesc') }}</p>
        </div>

        <div class="admin-filter-actions">
          <button
            type="button"
            class="reset-button"
            :disabled="pdfLoading"
            @click="downloadPdfReport"
          >
            <i class="bi bi-file-earmark-pdf"></i>
            {{ pdfLoading ? t('prizeConfig.downloadingPdf') : t('prizeConfig.downloadPdf') }}
          </button>

          <button
            type="button"
            class="primary-button"
            :class="{ 'save-button-dirty': hasUnsavedChanges }"
            @click="saveConfiguration"
          >
            <i class="bi bi-save"></i>
            {{ hasUnsavedChanges ? t('prizeConfig.saveChanges') : t('prizeConfig.saveConfig') }}
          </button>

          <button type="button" class="reset-button" @click="resetConfiguration">
            <i class="bi bi-arrow-counterclockwise"></i>
            {{ t('prizeConfig.resetDefault') }}
          </button>
        </div>
      </div>

      <!-- Basic Config -->
      <div class="admin-form-grid pricing-form-grid rtp-compact-form-grid">
        <div v-if="!isFreeSpinMode" class="admin-form-field">
          <label>{{ t('prizeConfig.calculationMode') }}</label>
          <select
            v-model="config.calculationMode"
            class="admin-select"
            @change="markAsChanged"
          >
            <option value="SUGGEST_PRICE">{{ t('prizeConfig.suggestPriceMode') }}</option>
            <option value="MANUAL_CHECK">{{ t('prizeConfig.manualCheckMode') }}</option>
          </select>
        </div>

        <div class="admin-form-field">
          <label>{{ t('prizeConfig.weightMode') }}</label>
          <select
            v-model="config.activeWeightMode"
            class="admin-select"
            @change="onWeightModeChanged"
          >
            <option value="PAID">{{ t('prizeConfig.paidSpin') }}</option>
            <option value="FREE">{{ t('prizeConfig.freeSpin') }}</option>
          </select>
        </div>

        <div class="admin-form-field">
          <label>{{ t('prizeConfig.spinCount') }}</label>
          <input
            v-model.number="config.spinCount"
            type="number"
            min="1"
            class="admin-input"
            @input="markAsChanged"
          />
        </div>

        <div class="admin-form-field">
          <label>{{ t('prizeConfig.currency') }}</label>
          <select v-model="config.currency" class="admin-select" @change="markAsChanged">
            <option value="USD">USD</option>
            <option value="KHR">KHR</option>
            <option value="CNY">CNY</option>
            <option value="THB">THB</option>
          </select>
        </div>

        <div v-if="!isFreeSpinMode" class="admin-form-field">
          <label>{{ t('prizeConfig.targetRtp') }}</label>
          <input
            v-model.number="config.targetRtp"
            type="number"
            min="0.01"
            max="100"
            step="0.01"
            class="admin-input"
            @input="onTargetRtpInput"
          />
        </div>

        <div v-if="!isFreeSpinMode" class="admin-form-field">
          <label>{{ t('prizeConfig.targetKillRate') }}</label>
          <input
            v-model.number="config.targetKillRate"
            type="number"
            min="0"
            max="99.99"
            step="0.01"
            class="admin-input"
            @input="onTargetKillRateInput"
          />
        </div>

        <div v-if="!isFreeSpinMode" class="admin-form-field">
          <label>{{ t('prizeConfig.suggestedSpinCost') }}</label>
          <input
            :value="formatMoney(currentSummary.suggestedSpinCost)"
            type="text"
            class="admin-input readonly-input"
            readonly
          />
        </div>

        <div
          v-if="!isFreeSpinMode && config.calculationMode === 'SUGGEST_PRICE'"
          class="admin-form-field"
        >
          <label>{{ t('prizeConfig.finalSpinCost') }}</label>
          <input
            v-model.number="config.finalSpinCost"
            type="number"
            min="0"
            step="0.01"
            class="admin-input"
            @input="markAsChanged"
          />
        </div>

        <div
          v-if="!isFreeSpinMode && config.calculationMode === 'MANUAL_CHECK'"
          class="admin-form-field"
        >
          <label>{{ t('prizeConfig.manualSpinCost') }}</label>
          <input
            v-model.number="config.manualSpinCost"
            type="number"
            min="0"
            step="0.01"
            class="admin-input"
            @input="markAsChanged"
          />
        </div>
      </div>

      <div class="pricing-mode-note rtp-compact-note">
        <i class="bi bi-info-circle"></i>
        <span>
          {{
            isFreeSpinMode
              ? t('prizeConfig.freeSpinModeNote')
              : config.calculationMode === 'SUGGEST_PRICE'
                ? t('prizeConfig.suggestPriceModeNote')
                : t('prizeConfig.manualCheckModeNote')
          }}
        </span>
      </div>

      <!-- Prize & Weight Setting -->
      <div class="rtp-config-divider"></div>

      <div class="rtp-prize-section-header">
        <div>
          <h2>{{ t('prizeConfig.prizeWeightSetting') }}</h2>
          <p>{{ t('prizeConfig.prizeListDesc') }}</p>
        </div>

        <button type="button" class="create-button" @click="addPrize">
          <i class="bi bi-plus-circle"></i>
          {{ t('prizeConfig.addPrize') }}
        </button>
      </div>

      <div class="weight-mode-note rtp-compact-note">
        <i class="bi bi-info-circle"></i>
        <span>
          {{
            isFreeSpinMode
              ? t('prizeConfig.currentUsingFreeWeightNoCost')
              : t('prizeConfig.currentUsingPaidWeight')
          }}
        </span>
      </div>

      <div class="admin-table-wrapper rtp-prize-table-wrapper">
        <table class="admin-table prize-config-table rtp-compact-prize-table">
          <colgroup>
            <col class="col-prize-name" />
            <col class="col-prize-type" />
            <col class="col-amount" />
            <col class="col-active-weight" />
            <col class="col-probability" />
            <col class="col-hit-count" />
            <col class="col-payout" />
            <col class="col-rtp" />
            <col class="col-active" />
            <col class="col-action" />
          </colgroup>

          <thead>
            <tr>
              <th>{{ t('prizeConfig.prizeName') }}</th>
              <th>{{ t('prizeConfig.prizeType') }}</th>
              <th class="text-right">{{ t('prizeConfig.amount') }}</th>
              <th class="text-right">
                {{ isFreeSpinMode ? t('prizeConfig.freeWeight') : t('prizeConfig.paidWeight') }}
              </th>
              <th class="text-right">{{ t('prizeConfig.currentProbability') }}</th>
              <th class="text-right">{{ t('prizeConfig.expectedHitCount') }}</th>
              <th class="text-right">{{ t('prizeConfig.expectedPayout') }}</th>
              <th class="text-right">
                {{
                  isFreeSpinMode
                    ? t('prizeConfig.costContribution')
                    : t('prizeConfig.rtpContribution')
                }}
              </th>
              <th class="text-center">{{ t('prizeConfig.active') }}</th>
              <th class="text-center">{{ t('prizeConfig.action') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="prize in prizes" :key="prize.id">
              <td>
                <input
                  v-model.trim="prize.prizeName"
                  type="text"
                  class="admin-input table-input"
                  @input="normalizePrize(prize)"
                />
              </td>

              <td>
                <select
                  v-model="prize.prizeType"
                  class="admin-select table-select"
                  @change="onPrizeTypeChanged(prize)"
                >
                  <option value="CASH">{{ t('prizeConfig.cash') }}</option>
                  <option value="NO_PRIZE">{{ t('prizeConfig.noPrize') }}</option>
                </select>
              </td>

              <td>
                <input
                  v-model.number="prize.amount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="admin-input table-input text-right"
                  :disabled="prize.prizeType === 'NO_PRIZE'"
                  @input="normalizePrize(prize)"
                />
              </td>

              <td>
                <input
                  v-if="!isFreeSpinMode"
                  v-model.number="prize.paidWeight"
                  type="number"
                  min="0"
                  step="1"
                  class="admin-input table-input text-right active-weight-input"
                  @input="normalizePrize(prize)"
                />

                <input
                  v-else
                  v-model.number="prize.freeWeight"
                  type="number"
                  min="0"
                  step="1"
                  class="admin-input table-input text-right active-weight-input"
                  @input="normalizePrize(prize)"
                />
              </td>

              <td class="text-right">
                <span class="table-main-text">
                  {{ formatPercent(getPrizeCalculatedRow(prize.id).probability) }}
                </span>
              </td>

              <td class="text-right">
                <span class="table-main-text">
                  {{ formatNumber(getPrizeCalculatedRow(prize.id).expectedHitCount, 2) }}
                </span>
              </td>

              <td class="text-right">
                <span class="table-main-text">
                  {{ formatMoney(getPrizeCalculatedRow(prize.id).expectedPayout) }}
                </span>
              </td>

              <td class="text-right">
                <span class="table-main-text">
                  {{
                    isFreeSpinMode
                      ? formatPercent(getPrizeCalculatedRow(prize.id).costContribution)
                      : formatPercent(getPrizeCalculatedRow(prize.id).rtpContribution)
                  }}
                </span>
              </td>

              <td class="text-center">
                <label class="switch-inline">
                  <input v-model="prize.isActive" type="checkbox" @change="normalizePrize(prize)" />
                  <span>
                    {{ prize.isActive ? t('prizeConfig.enabled') : t('prizeConfig.disabled') }}
                  </span>
                </label>
              </td>

              <td class="text-center">
                <div class="admin-table-actions-center">
                  <button
                    type="button"
                    class="admin-icon-btn admin-icon-btn-view"
                    :title="t('prizeConfig.moveTop')"
                    :disabled="getPrizeIndex(prize.id) === 0"
                    @click="movePrizeToTop(prize.id)"
                  >
                    <i class="bi bi-arrow-bar-up"></i>
                  </button>

                  <button
                    type="button"
                    class="admin-icon-btn admin-icon-btn-edit"
                    :title="t('prizeConfig.moveUp')"
                    :disabled="getPrizeIndex(prize.id) === 0"
                    @click="movePrizeUp(prize.id)"
                  >
                    <i class="bi bi-arrow-up"></i>
                  </button>

                  <button
                    type="button"
                    class="admin-icon-btn admin-icon-btn-edit"
                    :title="t('prizeConfig.moveDown')"
                    :disabled="getPrizeIndex(prize.id) === prizes.length - 1"
                    @click="movePrizeDown(prize.id)"
                  >
                    <i class="bi bi-arrow-down"></i>
                  </button>

                  <button
                    type="button"
                    class="admin-icon-btn admin-icon-btn-delete"
                    :title="t('prizeConfig.delete')"
                    @click="deletePrize(prize.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- =========================================================
      Alert Message - Paid Spin Only
      ========================================================= -->
    <div
      v-if="!isFreeSpinMode && currentSummary.companyProfit < 0"
      class="admin-alert admin-alert-danger rtp-compact-alert"
    >
      <i class="bi bi-exclamation-triangle"></i>
      {{ t('prizeConfig.lossWarning') }}
    </div>

    <div
      v-if="!isFreeSpinMode && currentSummary.actualRtp > 95"
      class="admin-alert admin-alert-danger rtp-compact-alert"
    >
      <i class="bi bi-exclamation-triangle"></i>
      {{ t('prizeConfig.highRtpWarning') }}
    </div>

    <!-- =========================================================
      2. Analysis Result - Key Result + Detailed Analysis
      ========================================================= -->
    <div class="admin-card rtp-result-card">
      <div class="rtp-section-header rtp-result-header">
        <div>
          <h2>{{ t('prizeConfig.analysisResult') }}</h2>
          <p>
            {{
              isFreeSpinMode
                ? t('prizeConfig.freeSpinAnalysisDesc')
                : t('prizeConfig.calculationSummaryDesc')
            }}
          </p>
        </div>
      </div>

      <!-- Paid Spin Key Result -->
      <div v-if="!isFreeSpinMode" class="rtp-compact-summary-grid rtp-result-summary-grid">
        <div class="rtp-compact-summary-item summary-card-blue">
          <div class="summary-icon">
            <i class="bi bi-cash-stack"></i>
          </div>

          <div class="summary-content">
            <span>{{ t('prizeConfig.suggestedSpinCost') }}</span>
            <strong>{{ formatMoney(currentSummary.suggestedSpinCost) }}</strong>
          </div>
        </div>

        <div class="rtp-compact-summary-item summary-card-purple">
          <div class="summary-icon">
            <i class="bi bi-pencil-square"></i>
          </div>

          <div class="summary-content">
            <span>
              {{
                config.calculationMode === 'MANUAL_CHECK'
                  ? t('prizeConfig.manualSpinCost')
                  : t('prizeConfig.finalSpinCost')
              }}
            </span>
            <strong>
              {{
                config.calculationMode === 'MANUAL_CHECK'
                  ? formatMoney(currentSummary.manualSpinCost)
                  : formatMoney(currentSummary.finalSpinCost)
              }}
            </strong>
          </div>
        </div>

        <div class="rtp-compact-summary-item summary-card-orange">
          <div class="summary-icon">
            <i class="bi bi-calculator"></i>
          </div>

          <div class="summary-content">
            <span>{{ t('prizeConfig.effectiveSpinCost') }}</span>
            <strong>{{ formatMoney(currentSummary.effectiveSpinCost) }}</strong>
          </div>
        </div>

        <div class="rtp-compact-summary-item summary-card-red">
          <div class="summary-icon">
            <i class="bi bi-percent"></i>
          </div>

          <div class="summary-content">
            <span>{{ t('prizeConfig.actualKillRate') }}</span>
            <strong :class="{ 'profit-negative': currentSummary.actualKillRate < 0 }">
              {{ formatPercent(currentSummary.actualKillRate) }}
            </strong>
          </div>
        </div>

        <div class="rtp-compact-summary-item summary-card-green">
          <div class="summary-icon">
            <i class="bi bi-graph-up-arrow"></i>
          </div>

          <div class="summary-content">
            <span>{{ t('prizeConfig.companyProfit') }}</span>
            <strong :class="{ 'profit-negative': currentSummary.companyProfit < 0 }">
              {{ formatMoney(currentSummary.companyProfit) }}
            </strong>
          </div>
        </div>
      </div>

      <!-- Free Spin Key Result -->
      <div v-else class="rtp-compact-summary-grid rtp-result-summary-grid">
        <div class="rtp-compact-summary-item summary-card-blue">
          <div class="summary-icon">
            <i class="bi bi-gift"></i>
          </div>

          <div class="summary-content">
            <span>{{ t('prizeConfig.averagePayout') }}</span>
            <strong>{{ formatMoney(currentSummary.averagePayout) }}</strong>
          </div>
        </div>

        <div class="rtp-compact-summary-item summary-card-purple">
          <div class="summary-icon">
            <i class="bi bi-wallet2"></i>
          </div>

          <div class="summary-content">
            <span>{{ t('prizeConfig.totalPayout') }}</span>
            <strong>{{ formatMoney(currentSummary.totalPayout) }}</strong>
          </div>
        </div>

        <div class="rtp-compact-summary-item summary-card-orange">
          <div class="summary-icon">
            <i class="bi bi-cash-coin"></i>
          </div>

          <div class="summary-content">
            <span>{{ t('prizeConfig.companyEstimatedCost') }}</span>
            <strong>{{ formatMoney(currentSummary.companyEstimatedCost) }}</strong>
          </div>
        </div>

        <div class="rtp-compact-summary-item summary-card-green">
          <div class="summary-icon">
            <i class="bi bi-trophy"></i>
          </div>

          <div class="summary-content">
            <span>{{ t('prizeConfig.winRate') }}</span>
            <strong>{{ formatPercent(currentSummary.winRate) }}</strong>
          </div>
        </div>

        <div class="rtp-compact-summary-item summary-card-red">
          <div class="summary-icon">
            <i class="bi bi-x-circle"></i>
          </div>

          <div class="summary-content">
            <span>{{ t('prizeConfig.noPrizeRate') }}</span>
            <strong>{{ formatPercent(currentSummary.noPrizeRate) }}</strong>
          </div>
        </div>
      </div>

      <div class="rtp-result-divider"></div>

      <!-- Detailed Analysis -->
      <div class="rtp-calculation-group-grid rtp-result-detail-grid">
        <div class="rtp-calculation-group">
          <div class="rtp-calculation-group-title">
            <i class="bi bi-sliders"></i>
            <span>{{ t('prizeConfig.weightAndProbability') }}</span>
          </div>

          <div class="rtp-mini-result-list">
            <div class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.weightMode') }}</span>
              <strong>
                {{
                  isFreeSpinMode
                    ? t('prizeConfig.freeSpin')
                    : t('prizeConfig.paidSpin')
                }}
              </strong>
            </div>

            <div class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.totalWeight') }}</span>
              <strong>{{ formatNumber(currentSummary.totalWeight, 0) }}</strong>
            </div>

            <div class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.winRate') }}</span>
              <strong>{{ formatPercent(currentSummary.winRate) }}</strong>
            </div>

            <div class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.noPrizeRate') }}</span>
              <strong>{{ formatPercent(currentSummary.noPrizeRate) }}</strong>
            </div>

            <div class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.averagePayout') }}</span>
              <strong>{{ formatMoney(currentSummary.averagePayout) }}</strong>
            </div>
          </div>
        </div>

        <div class="rtp-calculation-group">
          <div class="rtp-calculation-group-title">
            <i class="bi bi-wallet2"></i>
            <span>
              {{
                isFreeSpinMode
                  ? t('prizeConfig.costAndPayout')
                  : t('prizeConfig.investmentAndPayout')
              }}
            </span>
          </div>

          <div class="rtp-mini-result-list">
            <div class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.spinCount') }}</span>
              <strong>{{ formatNumber(config.spinCount, 0) }}</strong>
            </div>

            <div v-if="!isFreeSpinMode" class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.effectiveSpinCost') }}</span>
              <strong>{{ formatMoney(currentSummary.effectiveSpinCost) }}</strong>
            </div>

            <div v-if="!isFreeSpinMode" class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.totalInvestment') }}</span>
              <strong>{{ formatMoney(currentSummary.totalInvestment) }}</strong>
            </div>

            <div class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.totalPayout') }}</span>
              <strong>{{ formatMoney(currentSummary.totalPayout) }}</strong>
            </div>

            <div v-if="isFreeSpinMode" class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.companyEstimatedCost') }}</span>
              <strong>{{ formatMoney(currentSummary.companyEstimatedCost) }}</strong>
            </div>

            <div v-if="!isFreeSpinMode" class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.companyProfit') }}</span>
              <strong :class="{ 'profit-negative': currentSummary.companyProfit < 0 }">
                {{ formatMoney(currentSummary.companyProfit) }}
              </strong>
            </div>

            <div v-if="!isFreeSpinMode" class="rtp-mini-result-row">
              <span>{{ t('prizeConfig.profitRate') }}</span>
              <strong :class="{ 'profit-negative': currentSummary.companyProfitRate < 0 }">
                {{ formatPercent(currentSummary.companyProfitRate) }}
              </strong>
            </div>
          </div>
        </div>

        <div class="rtp-calculation-group">
          <div class="rtp-calculation-group-title">
            <i class="bi bi-bullseye"></i>
            <span>
              {{
                isFreeSpinMode
                  ? t('prizeConfig.freeSpinSummary')
                  : t('prizeConfig.rtpAndKillRate')
              }}
            </span>
          </div>

          <div class="rtp-mini-result-list">
            <template v-if="!isFreeSpinMode">
              <div class="rtp-mini-result-row">
                <span>{{ t('prizeConfig.targetRtp') }}</span>
                <strong>{{ formatPercent(currentSummary.targetRtp) }}</strong>
              </div>

              <div class="rtp-mini-result-row">
                <span>{{ t('prizeConfig.targetKillRate') }}</span>
                <strong>{{ formatPercent(currentSummary.targetKillRate) }}</strong>
              </div>

              <div class="rtp-mini-result-row">
                <span>{{ t('prizeConfig.actualRtp') }}</span>
                <strong>{{ formatPercent(currentSummary.actualRtp) }}</strong>
              </div>

              <div class="rtp-mini-result-row">
                <span>{{ t('prizeConfig.actualKillRate') }}</span>
                <strong :class="{ 'profit-negative': currentSummary.actualKillRate < 0 }">
                  {{ formatPercent(currentSummary.actualKillRate) }}
                </strong>
              </div>

              <div class="rtp-mini-result-row">
                <span>{{ t('prizeConfig.suggestedSpinCost') }}</span>
                <strong>{{ formatMoney(currentSummary.suggestedSpinCost) }}</strong>
              </div>
            </template>

            <template v-else>
              <div class="rtp-mini-result-row">
                <span>{{ t('prizeConfig.freeSpinCost') }}</span>
                <strong>{{ formatMoney(0) }}</strong>
              </div>

              <div class="rtp-mini-result-row">
                <span>{{ t('prizeConfig.averagePayout') }}</span>
                <strong>{{ formatMoney(currentSummary.averagePayout) }}</strong>
              </div>

              <div class="rtp-mini-result-row">
                <span>{{ t('prizeConfig.totalPayout') }}</span>
                <strong>{{ formatMoney(currentSummary.totalPayout) }}</strong>
              </div>

              <div class="rtp-mini-result-row">
                <span>{{ t('prizeConfig.companyEstimatedCost') }}</span>
                <strong>{{ formatMoney(currentSummary.companyEstimatedCost) }}</strong>
              </div>

              <div class="rtp-mini-result-row">
                <span>{{ t('prizeConfig.freeSpinNoRtpNote') }}</span>
                <strong>-</strong>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
      Floating Toast
      ========================================================= -->
    <div v-if="toastMessage" class="rtp-toast" :class="toastTypeClass">
      <i :class="toastIcon"></i>
      <span>{{ toastMessage }}</span>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import html2pdf from 'html2pdf.js'

import AppLayout from '../components/AppLayout.vue'
import {
  calculateExpectedSummary,
  calculatePrizeRows,
  createDefaultConfig,
  createDefaultPrizes,
  toNumber,
} from '../utils/rtpCalculator'

const { t, locale } = useI18n()

const STORAGE_CONFIG_KEY = 'rtpSimulatorPrizeConfig'
const STORAGE_PRIZES_KEY = 'rtpSimulatorPrizeList'

const config = ref(createDefaultConfig())
const prizes = ref(createDefaultPrizes())
const hasUnsavedChanges = ref(false)
const pdfLoading = ref(false)

const toastMessage = ref('')
const toastType = ref('warning')
let toastTimer = null

const isFreeSpinMode = computed(() => {
  return config.value.activeWeightMode === 'FREE'
})

const activeWeightField = computed(() => {
  return isFreeSpinMode.value ? 'freeWeight' : 'paidWeight'
})

const currentSummary = computed(() => {
  const summary = calculateExpectedSummary(prizes.value, config.value, activeWeightField.value)

  if (isFreeSpinMode.value) {
    return {
      ...summary,
      effectiveSpinCost: 0,
      totalInvestment: 0,
      actualRtp: 0,
      actualKillRate: 0,
      companyProfit: 0,
      companyProfitRate: 0,
      companyEstimatedCost: summary.totalPayout,
    }
  }

  return {
    ...summary,
    companyEstimatedCost: summary.totalPayout,
  }
})

const currentPrizeRows = computed(() => {
  const rows = calculatePrizeRows(prizes.value, config.value, activeWeightField.value)

  if (!isFreeSpinMode.value || currentSummary.value.totalPayout <= 0) {
    return rows.map((row) => ({
      ...row,
      costContribution: 0,
    }))
  }

  return rows.map((row) => ({
    ...row,
    costContribution: (toNumber(row.expectedPayout) / currentSummary.value.totalPayout) * 100,
  }))
})

const toastTypeClass = computed(() => {
  return toastType.value === 'success' ? 'rtp-toast-success' : 'rtp-toast-warning'
})

const toastIcon = computed(() => {
  return toastType.value === 'success'
    ? 'bi bi-check-circle'
    : 'bi bi-exclamation-circle'
})

function getPrizeCalculatedRow(prizeId) {
  return (
    currentPrizeRows.value.find((item) => item.id === prizeId) || {
      probability: 0,
      expectedHitCount: 0,
      expectedPayout: 0,
      rtpContribution: 0,
      costContribution: 0,
    }
  )
}

function formatNumber(value, digits = 2) {
  const numberValue = toNumber(value)

  return numberValue.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

function formatMoney(value) {
  const numberValue = toNumber(value)
  const currency = config.value.currency || 'USD'

  return `${currency} ${numberValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatPercent(value) {
  return `${formatNumber(value, 2)}%`
}

function showToast(message, type = 'warning') {
  toastMessage.value = message
  toastType.value = type

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2500)
}

function markAsChanged() {
  hasUnsavedChanges.value = true
  showToast(t('prizeConfig.unsavedChanges'), 'warning')
}

function onWeightModeChanged() {
  if (isFreeSpinMode.value) {
    config.value.calculationMode = 'SUGGEST_PRICE'
  }

  markAsChanged()
}

function onTargetKillRateInput() {
  let killRate = Math.max(0, toNumber(config.value.targetKillRate))
  killRate = Math.min(99.99, killRate)

  config.value.targetKillRate = killRate
  config.value.targetRtp = Number((100 - killRate).toFixed(2))

  markAsChanged()
}

function onTargetRtpInput() {
  let rtp = Math.max(0.01, toNumber(config.value.targetRtp))
  rtp = Math.min(100, rtp)

  config.value.targetRtp = rtp
  config.value.targetKillRate = Number((100 - rtp).toFixed(2))

  markAsChanged()
}

function normalizePrize(prize) {
  prize.prizeType = prize.prizeType === 'NO_PRIZE' ? 'NO_PRIZE' : 'CASH'

  prize.amount = prize.prizeType === 'NO_PRIZE' ? 0 : Math.max(0, toNumber(prize.amount))
  prize.paidWeight = Math.max(0, toNumber(prize.paidWeight))
  prize.freeWeight = Math.max(0, toNumber(prize.freeWeight))
  prize.isActive = prize.isActive !== false

  markAsChanged()
}

function onPrizeTypeChanged(prize) {
  if (prize.prizeType === 'NO_PRIZE') {
    prize.amount = 0
  }

  normalizePrize(prize)
}

function addPrize() {
  prizes.value.push({
    id: crypto.randomUUID(),
    prizeName: t('prizeConfig.newPrize'),
    prizeType: 'CASH',
    amount: 1,
    paidWeight: 100,
    freeWeight: 100,
    isActive: true,
  })

  markAsChanged()
}

function getPrizeIndex(prizeId) {
  return prizes.value.findIndex((prize) => prize.id === prizeId)
}

function movePrizeToTop(prizeId) {
  const currentIndex = getPrizeIndex(prizeId)

  if (currentIndex <= 0) {
    return
  }

  const [selectedPrize] = prizes.value.splice(currentIndex, 1)
  prizes.value.unshift(selectedPrize)

  markAsChanged()
}

function movePrizeUp(prizeId) {
  const currentIndex = getPrizeIndex(prizeId)

  if (currentIndex <= 0) {
    return
  }

  const selectedPrize = prizes.value[currentIndex]
  prizes.value[currentIndex] = prizes.value[currentIndex - 1]
  prizes.value[currentIndex - 1] = selectedPrize

  markAsChanged()
}

function movePrizeDown(prizeId) {
  const currentIndex = getPrizeIndex(prizeId)

  if (currentIndex < 0 || currentIndex >= prizes.value.length - 1) {
    return
  }

  const selectedPrize = prizes.value[currentIndex]
  prizes.value[currentIndex] = prizes.value[currentIndex + 1]
  prizes.value[currentIndex + 1] = selectedPrize

  markAsChanged()
}

function deletePrize(prizeId) {
  prizes.value = prizes.value.filter((prize) => prize.id !== prizeId)
  markAsChanged()
}

function saveConfiguration() {
  localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config.value))
  localStorage.setItem(STORAGE_PRIZES_KEY, JSON.stringify(prizes.value))

  hasUnsavedChanges.value = false
  showToast(t('prizeConfig.saveSuccess'), 'success')
}

function resetConfiguration() {
  config.value = createDefaultConfig()
  prizes.value = createDefaultPrizes()

  localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config.value))
  localStorage.setItem(STORAGE_PRIZES_KEY, JSON.stringify(prizes.value))

  hasUnsavedChanges.value = false
  showToast(t('prizeConfig.resetSuccess'), 'success')
}

/* =========================================================
   PDF Report Download
   ========================================================= */

function waitForPdfRender() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
}

function getPdfLanguage() {
  return locale.value === 'zh' ? 'zh' : 'en'
}

function getPdfFileName() {
  const now = new Date()
  const dateText = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  const timeText = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
  ].join('')

  return getPdfLanguage() === 'zh'
    ? `杀率配置报告-${dateText}-${timeText}.pdf`
    : `rtp-configuration-report-${dateText}-${timeText}.pdf`
}

function getPdfGeneratedTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')

  const timezoneOffset = -now.getTimezoneOffset()
  const timezoneSign = timezoneOffset >= 0 ? '+' : '-'
  const timezoneHour = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0')
  const timezoneMinute = String(Math.abs(timezoneOffset) % 60).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second} UTC${timezoneSign}${timezoneHour}:${timezoneMinute}`
}

function getPrizeTypeText(prizeType) {
  return prizeType === 'NO_PRIZE' ? t('prizeConfig.noPrize') : t('prizeConfig.cash')
}

function getWeightModeText() {
  return isFreeSpinMode.value ? t('prizeConfig.freeSpin') : t('prizeConfig.paidSpin')
}

function getCalculationModeText() {
  if (isFreeSpinMode.value) {
    return t('prizeConfig.freeSpin')
  }

  return config.value.calculationMode === 'MANUAL_CHECK'
    ? t('prizeConfig.manualCheckMode')
    : t('prizeConfig.suggestPriceMode')
}

function buildPdfBasicRows() {
  const rows = [
    [t('prizeConfig.weightMode'), getWeightModeText()],
    [t('prizeConfig.calculationMode'), getCalculationModeText()],
    [t('prizeConfig.spinCount'), formatNumber(config.value.spinCount, 0)],
    [t('prizeConfig.currency'), config.value.currency || 'USD'],
  ]

  if (!isFreeSpinMode.value) {
    rows.push(
      [t('prizeConfig.targetRtp'), formatPercent(currentSummary.value.targetRtp)],
      [t('prizeConfig.targetKillRate'), formatPercent(currentSummary.value.targetKillRate)],
      [t('prizeConfig.suggestedSpinCost'), formatMoney(currentSummary.value.suggestedSpinCost)],
      [
        config.value.calculationMode === 'MANUAL_CHECK'
          ? t('prizeConfig.manualSpinCost')
          : t('prizeConfig.finalSpinCost'),
        config.value.calculationMode === 'MANUAL_CHECK'
          ? formatMoney(currentSummary.value.manualSpinCost)
          : formatMoney(currentSummary.value.finalSpinCost),
      ],
      [t('prizeConfig.effectiveSpinCost'), formatMoney(currentSummary.value.effectiveSpinCost)]
    )
  }

  return rows
}

function buildPdfAnalysisRows() {
  const rows = [
    [t('prizeConfig.totalWeight'), formatNumber(currentSummary.value.totalWeight, 0)],
    [t('prizeConfig.winRate'), formatPercent(currentSummary.value.winRate)],
    [t('prizeConfig.noPrizeRate'), formatPercent(currentSummary.value.noPrizeRate)],
    [t('prizeConfig.averagePayout'), formatMoney(currentSummary.value.averagePayout)],
    [t('prizeConfig.totalPayout'), formatMoney(currentSummary.value.totalPayout)],
  ]

  if (isFreeSpinMode.value) {
    rows.push(
      [t('prizeConfig.companyEstimatedCost'), formatMoney(currentSummary.value.companyEstimatedCost)],
      [t('prizeConfig.freeSpinNoRtpNote'), '-']
    )
  } else {
    rows.push(
      [t('prizeConfig.totalInvestment'), formatMoney(currentSummary.value.totalInvestment)],
      [t('prizeConfig.actualRtp'), formatPercent(currentSummary.value.actualRtp)],
      [t('prizeConfig.actualKillRate'), formatPercent(currentSummary.value.actualKillRate)],
      [t('prizeConfig.companyProfit'), formatMoney(currentSummary.value.companyProfit)],
      [t('prizeConfig.profitRate'), formatPercent(currentSummary.value.companyProfitRate)]
    )
  }

  return rows
}

function buildPdfPrizeRows() {
  return prizes.value.map((prize) => {
    const row = getPrizeCalculatedRow(prize.id)
    const activeWeight = isFreeSpinMode.value ? prize.freeWeight : prize.paidWeight

    return {
      prizeName: prize.prizeName || '-',
      prizeType: getPrizeTypeText(prize.prizeType),
      amount: formatMoney(prize.amount),
      activeWeight: formatNumber(activeWeight, 0),
      probability: formatPercent(row.probability),
      expectedHitCount: formatNumber(row.expectedHitCount, 2),
      expectedPayout: formatMoney(row.expectedPayout),
      contribution: isFreeSpinMode.value
        ? formatPercent(row.costContribution)
        : formatPercent(row.rtpContribution),
      active: prize.isActive ? t('prizeConfig.enabled') : t('prizeConfig.disabled'),
    }
  })
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderPdfRows(rows) {
  return rows
    .map(
      ([label, value]) => `
        <div class="pdf-info-row">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `
    )
    .join('')
}

function renderPdfPrizeTable() {
  const activeWeightTitle = isFreeSpinMode.value
    ? t('prizeConfig.freeWeight')
    : t('prizeConfig.paidWeight')

  const contributionTitle = isFreeSpinMode.value
    ? t('prizeConfig.costContribution')
    : t('prizeConfig.rtpContribution')

  const rows = buildPdfPrizeRows()
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.prizeName)}</td>
          <td>${escapeHtml(item.prizeType)}</td>
          <td class="text-right">${escapeHtml(item.amount)}</td>
          <td class="text-right">${escapeHtml(item.activeWeight)}</td>
          <td class="text-right">${escapeHtml(item.probability)}</td>
          <td class="text-right">${escapeHtml(item.expectedHitCount)}</td>
          <td class="text-right">${escapeHtml(item.expectedPayout)}</td>
          <td class="text-right">${escapeHtml(item.contribution)}</td>
          <td>${escapeHtml(item.active)}</td>
        </tr>
      `
    )
    .join('')

  return `
    <table class="pdf-table">
      <thead>
        <tr>
          <th>${escapeHtml(t('prizeConfig.prizeName'))}</th>
          <th>${escapeHtml(t('prizeConfig.prizeType'))}</th>
          <th class="text-right">${escapeHtml(t('prizeConfig.amount'))}</th>
          <th class="text-right">${escapeHtml(activeWeightTitle)}</th>
          <th class="text-right">${escapeHtml(t('prizeConfig.currentProbability'))}</th>
          <th class="text-right">${escapeHtml(t('prizeConfig.expectedHitCount'))}</th>
          <th class="text-right">${escapeHtml(t('prizeConfig.expectedPayout'))}</th>
          <th class="text-right">${escapeHtml(contributionTitle)}</th>
          <th>${escapeHtml(t('prizeConfig.active'))}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `
}

function buildPdfHtml() {
  const noteText = isFreeSpinMode.value
    ? t('prizeConfig.freeSpinAnalysisDesc')
    : t('prizeConfig.calculationSummaryDesc')

  return `
    <div class="pdf-report">
      <style>
        .pdf-report {
          width: 100%;
          box-sizing: border-box;
          padding: 22px;
          color: #111827;
          background: #ffffff;
          font-family: Arial, "Microsoft YaHei", "PingFang SC", sans-serif;
        }

        .pdf-title {
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 2px solid #2563eb;
        }

        .pdf-title h1 {
          margin: 0 0 6px;
          font-size: 22px;
          color: #111827;
          font-weight: 800;
        }

        .pdf-title p {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
        }

        .pdf-section {
          margin-top: 18px;
          page-break-inside: avoid;
        }

        .pdf-section h2 {
          margin: 0 0 10px;
          font-size: 16px;
          color: #1f2937;
          font-weight: 800;
        }

        .pdf-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 14px;
        }

        .pdf-info-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: #f9fafb;
          font-size: 12px;
        }

        .pdf-info-row span {
          color: #6b7280;
        }

        .pdf-info-row strong {
          color: #111827;
          text-align: right;
        }

        .pdf-note {
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 6px;
          background: #eff6ff;
          color: #1e40af;
          font-size: 12px;
          line-height: 1.6;
        }

        .pdf-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }

        .pdf-table th {
          padding: 7px 6px;
          border: 1px solid #d1d5db;
          background: #f3f4f6;
          color: #374151;
          text-align: left;
          font-weight: 700;
        }

        .pdf-table td {
          padding: 7px 6px;
          border: 1px solid #e5e7eb;
          color: #111827;
          vertical-align: top;
        }

        .pdf-table tbody tr:nth-child(even) td {
          background: #f9fafb;
        }

        .text-right {
          text-align: right !important;
        }
      </style>

      <div class="pdf-title">
        <h1>${escapeHtml(t('prizeConfig.pdfReportTitle'))}</h1>
        <p>${escapeHtml(t('prizeConfig.pdfGeneratedAt'))}: ${escapeHtml(getPdfGeneratedTime())}</p>
      </div>

      <div class="pdf-section">
        <h2>${escapeHtml(t('prizeConfig.pdfBasicConfig'))}</h2>
        <div class="pdf-info-grid">
          ${renderPdfRows(buildPdfBasicRows())}
        </div>
      </div>

      <div class="pdf-section">
        <h2>${escapeHtml(t('prizeConfig.pdfAnalysisResult'))}</h2>
        <div class="pdf-info-grid">
          ${renderPdfRows(buildPdfAnalysisRows())}
        </div>

        <div class="pdf-note">
          ${escapeHtml(noteText)}
        </div>
      </div>

      <div class="pdf-section">
        <h2>${escapeHtml(t('prizeConfig.pdfPrizeDetail'))}</h2>
        ${renderPdfPrizeTable()}
      </div>
    </div>
  `
}

async function downloadPdfReport() {
  if (pdfLoading.value) {
    return
  }

  pdfLoading.value = true

  const reportElement = document.createElement('div')

  try {
    reportElement.innerHTML = buildPdfHtml()

    Object.assign(reportElement.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '1120px',
      minHeight: '600px',
      background: '#ffffff',
      zIndex: '99999',
      pointerEvents: 'none',
    })

    document.body.appendChild(reportElement)

    await waitForPdfRender()

    const pdfTarget = reportElement.querySelector('.pdf-report') || reportElement

    const options = {
      margin: 8,
      filename: getPdfFileName(),
      image: {
        type: 'jpeg',
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1120,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape',
      },
      pagebreak: {
        mode: ['css', 'legacy'],
      },
    }

    await html2pdf().set(options).from(pdfTarget).save()

    showToast(t('prizeConfig.pdfDownloadSuccess'), 'success')
  } catch (error) {
    console.error('PDF download failed:', error)
    showToast(t('prizeConfig.pdfDownloadFailed'), 'warning')
  } finally {
    if (document.body.contains(reportElement)) {
      document.body.removeChild(reportElement)
    }

    pdfLoading.value = false
  }
}

function loadSavedConfiguration() {
  const savedConfig = localStorage.getItem(STORAGE_CONFIG_KEY)
  const savedPrizes = localStorage.getItem(STORAGE_PRIZES_KEY)

  if (savedConfig) {
    try {
      const parsedConfig = JSON.parse(savedConfig)

      config.value = {
        ...createDefaultConfig(),
        ...parsedConfig,
        calculationMode: parsedConfig.calculationMode || 'SUGGEST_PRICE',
        manualSpinCost: parsedConfig.manualSpinCost ?? parsedConfig.spinCost ?? 2,
        finalSpinCost: parsedConfig.finalSpinCost ?? 0,
        targetRtp: parsedConfig.targetRtp ?? 80,
        targetKillRate: parsedConfig.targetKillRate ?? 100 - (parsedConfig.targetRtp ?? 80),
      }
    } catch {
      config.value = createDefaultConfig()
    }
  }

  if (savedPrizes) {
    try {
      const parsedPrizes = JSON.parse(savedPrizes)

      if (Array.isArray(parsedPrizes) && parsedPrizes.length > 0) {
        prizes.value = parsedPrizes.map((prize) => {
          const normalizedPrizeType = prize.prizeType === 'NO_PRIZE' ? 'NO_PRIZE' : 'CASH'

          return {
            id: prize.id || crypto.randomUUID(),
            prizeName: prize.prizeName || '',
            prizeType: normalizedPrizeType,
            amount:
              normalizedPrizeType === 'NO_PRIZE'
                ? 0
                : Math.max(0, toNumber(prize.amount)),
            paidWeight: Math.max(0, toNumber(prize.paidWeight)),
            freeWeight: Math.max(0, toNumber(prize.freeWeight)),
            isActive: prize.isActive !== false,
          }
        })
      }
    } catch {
      prizes.value = createDefaultPrizes()
    }
  }

  hasUnsavedChanges.value = false
}

onMounted(() => {
  loadSavedConfiguration()
})
</script>