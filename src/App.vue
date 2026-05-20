<script setup>
import { watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const updateBrowserTitle = (lang) => {
  document.title = lang === "zh" ? "杀率模拟器" : "RTP Simulator";
};

onMounted(() => {
  updateBrowserTitle(locale.value);
});

watch(locale, (newLang) => {
  updateBrowserTitle(newLang);
});
</script>

<template>
  <router-view />
</template>