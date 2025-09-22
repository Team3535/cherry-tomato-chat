<template>
  <div class="scan-page">
    <div class="submit-area">
      <div class="select-area">
        <n-select v-model:value="renderer" :options="rendererOptions"></n-select>
      </div>
      <drag-img-input @upload-file="handleUploadFile"></drag-img-input>
      <div class="preview-area">
        <img v-if="ocrStore.img" :src="ocrStore.img" alt="preview-img" />
        <div v-else>预览图片,也许什么都没有</div>
      </div>
      <div class="btn-area">
        <n-button class="cancel-btn" @click="handleCancel"
          ><n-icon size="24"> <backspace /></n-icon
        ></n-button>
        <n-button class="upload-btn" @click="handleOcrUpload"
          ><n-icon size="24"> <table-import /></n-icon
        ></n-button>
      </div>
    </div>
    <div class="result-area">
      <div v-if="result" class="result-show">
        <div class="title">扫描结果</div>
        <div v-if="renderTable" ref="tableContainer"></div>
        <div v-else>
          <pre>{{ result }}</pre>
        </div>
      </div>
      <div v-else class="preview-result">
        <img
          v-if="isLoading"
          src="../public/loading.gif"
          alt="loading"
          class="loading-spinner-img"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NIcon, NButton, useMessage, NSelect } from 'naive-ui'
import { TableImport, Backspace } from '@vicons/tabler'
import DragImgInput from '../components/DragImgInput.vue'
import { computed, ref, watch } from 'vue'
import { useOcrStore } from '../stores/ocr'
import { renderLaTeXTable } from '../utils'
import { nextTick } from 'process'

const message = useMessage()
const renderer = ref('text')
const isLoading = ref(false)
const rendererOptions = [
  { label: 'text', value: 'text' },
  { label: 'table', value: 'table' }
]
const result = ref('')
const tableContainer = ref<HTMLDivElement | null>(null)
const ocrStore = useOcrStore()
watch(result, (newVal) => {
  nextTick(() => {
    if (tableContainer.value && renderTable.value) {
      renderLaTeXTable(newVal, tableContainer.value)
    }
  })
})
const renderTable = computed(() => renderer.value == 'table')
/* const handleOcrUpload = async (): Promise<void> => {
  if (ocrStore.img) {
    try {
      result.value = ''
      isLoading.value = true
      result.value = await window.api.ocrAPI.ask(ocrStore.img, lang.value)
      if (result.value) {
        console.log(result.value)
        message.success('文字提取完成')
      }
    } catch (error) {
      message.error(String(error))
    } finally {
      isLoading.value = false
    }
  } else {
    message.warning(' 未上传文件')
  }
} */
const handleOcrUpload = async (): Promise<void> => {
  if (ocrStore.img) {
    try {
      result.value = ''
      isLoading.value = true
      result.value = await window.api.ocrAPI.ask(ocrStore.img, renderTable.value)
      if (result.value) {
        console.log(result.value)
        message.success('文字提取完成')
      }
    } catch (error) {
      message.error(String(error))
    } finally {
      isLoading.value = false
    }
  } else {
    message.warning(' 未上传文件')
  }
}
const handleUploadFile = (base64: string): void => {
  ocrStore.img = base64
  message.success('上传完成')
}
const handleCancel = (): void => {
  ocrStore.img = ''
  result.value = ''
  message.info('撤回图片及其扫描结果')
}
</script>

<style scoped>
.scan-page {
  height: 100%;
  width: 100%;
  display: flex;
}
.submit-area {
  position: relative;
  display: flex;
  top: 5%;
  left: 10%;
  width: 40%;
  height: 90%;
  color: rgba(104, 98, 98, 0.9);
  backdrop-filter: blur(6px);
  flex-direction: column;
}
.select-area {
  width: 6rem;
}
.btn-area {
  display: flex;
  padding: 1%;
  width: 100%;
  justify-content: space-between;
}
.btn-area n-button {
  backdrop-filter: blur(6px);
  margin: 1rem;
  border-radius: 1rem;
}
.preview-area {
  width: 100%;
  height: 35%;
  padding-bottom: 1%;
  padding-top: 5%;
  text-align: center;
  border: 0.1875rem dashed #ccc;
  border-radius: 0.5rem;
}
.preview-area img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.result-area {
  position: relative;
  display: flex;
  top: 5%;
  left: 15%;
  width: 40%;
  height: 90%;
  color: rgba(104, 98, 98, 0.9);
  backdrop-filter: blur(6px);
  user-select: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.loading-spinner-img {
  display: block;
  margin: 0.5rem auto;
  width: 5rem;
  height: 5rem;
  mix-blend-mode: lighten;
}
.preview-result {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
