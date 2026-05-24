<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ImagePlus, Loader2, Send, X } from "lucide-vue-next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const router = useRouter();
const caption = ref("");
const selectedFiles = ref<File[]>([]);
const isSubmitting = ref(false);
const statusMessage = ref("");
const errorMessage = ref("");
const isErrorDialogOpen = ref(false);
const isSuccessDialogOpen = ref(false);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    selectedFiles.value = [...selectedFiles.value, ...Array.from(input.files)];
  }
  input.value = "";
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const getToken = () => localStorage.getItem("@MktApp:token");

const handleSubmit = async () => {
  if (!caption.value) {
    showError("A legenda da postagem é obrigatória.");
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    statusMessage.value = "Criando postagem...";
    const postResponse = await fetch(
      `${import.meta.env.VITE_RENDER_API_URL}/media/posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          caption: caption.value,
        }),
      },
    );

    if (!postResponse.ok) await throwApiError(postResponse);

    const rawPostId = await postResponse.text();
    const postId = rawPostId.replace(/^"|"$/g, "");

    if (selectedFiles.value.length > 0) {
      for (let i = 0; i < selectedFiles.value.length; i++) {
        const file = selectedFiles.value[i];
        statusMessage.value = `Enviando arquivo ${i + 1} de ${selectedFiles.value.length}...`;

        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch(
          `${import.meta.env.VITE_RENDER_API_URL}/media/files`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
            body: formData,
          },
        );

        if (!uploadResponse.ok) await throwApiError(uploadResponse);

        const rawMediaId = await uploadResponse.text();
        const mediaId = rawMediaId.replace(/^"|"$/g, "");

        statusMessage.value = `Processando arquivo ${i + 1}...`;
        const linkResponse = await fetch(
          `${import.meta.env.VITE_RENDER_API_URL}/media/posts/${postId}/assets`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
              mediaId: mediaId,
              sequenceOrder: i + 1,
            }),
          },
        );

        if (!linkResponse.ok) await throwApiError(linkResponse);
      }
    }

    isSuccessDialogOpen.value = true;
    caption.value = "";
    selectedFiles.value = [];
  } catch (error: any) {
    showError(error.message || "Falha na comunicação com o servidor.");
  } finally {
    isSubmitting.value = false;
    statusMessage.value = "";
  }
};

const throwApiError = async (response: Response) => {
  const rawText = await response.text();
  let apiMessage = "Erro interno no servidor.";
  if (rawText) {
    try {
      const errorData = JSON.parse(rawText);
      apiMessage =
        errorData.message || errorData.detail || errorData.title || rawText;
    } catch {
      apiMessage = rawText;
    }
  }
  throw new Error(apiMessage);
};

const showError = (msg: string) => {
  errorMessage.value = msg;
  isErrorDialogOpen.value = true;
};
</script>

<template>
  <div class="p-8">
    <div class="mb-8 max-w-3xl">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">
        Criar Nova Postagem
      </h1>
      <p class="text-gray-600">
        Escreva sua legenda e anexe as mídias em um único passo.
      </p>
    </div>

    <div
      class="max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 p-8"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Legenda da Publicação *</label
          >
          <textarea
            v-model="caption"
            rows="5"
            placeholder="O que você quer compartilhar hoje?"
            class="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-vibrant-green focus:border-transparent outline-none transition-all resize-none text-gray-900"
            :disabled="isSubmitting"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Mídias (Opcional)</label
          >
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors"
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/*"
              class="hidden"
              @change="handleFileChange"
              :disabled="isSubmitting"
            />
            <label
              for="file-upload"
              class="cursor-pointer flex flex-col items-center"
            >
              <div class="p-4 bg-soft-green/30 rounded-full mb-3">
                <ImagePlus class="w-6 h-6 text-vibrant-green" />
              </div>
              <span class="text-sm font-medium text-gray-900"
                >Clique para selecionar arquivos</span
              >
              <span class="text-xs text-gray-500 mt-1"
                >PNG, JPG, MP4 suportados</span
              >
            </label>
          </div>

          <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center truncate">
                <ImagePlus class="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                <span class="text-sm text-gray-700 truncate">{{
                  file.name
                }}</span>
              </div>
              <button
                type="button"
                @click="removeFile(index)"
                :disabled="isSubmitting"
                class="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-between pt-4 border-t border-gray-100"
        >
          <span class="text-sm font-medium text-vibrant-green animate-pulse">
            {{ isSubmitting ? statusMessage : "" }}
          </span>
          <div class="flex gap-4">
            <button
              type="button"
              @click="router.back()"
              :disabled="isSubmitting"
              class="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !caption"
              class="flex items-center bg-vibrant-green hover:bg-vibrant-green/90 text-white font-medium py-3 px-8 rounded-lg transition-all disabled:opacity-50"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              <Send v-else class="w-4 h-4 mr-2" />
              Publicar
            </button>
          </div>
        </div>
      </form>
    </div>

    <Dialog v-model:open="isSuccessDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-vibrant-green">Postagem Criada!</DialogTitle>
          <DialogDescription
            >Sua postagem e mídias foram processadas com
            sucesso.</DialogDescription
          >
        </DialogHeader>
        <DialogFooter>
          <button
            @click="isSuccessDialogOpen = false"
            class="w-full bg-vibrant-green text-white py-2 rounded-lg"
          >
            Continuar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="isErrorDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-red-600">Erro na Operação</DialogTitle>
          <DialogDescription>{{ errorMessage }}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            @click="isErrorDialogOpen = false"
            class="w-full bg-gray-100 py-2 rounded-lg text-gray-900"
          >
            Fechar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
