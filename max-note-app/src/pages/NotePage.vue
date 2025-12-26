<script lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//import { useLocalNotes } from 'src/helper'
import { onMounted } from 'vue';
import { NotesApi, type Note } from 'src/api/notes';
import Container from 'src/components/ContainerComponents.vue';

export default {
  components: { Container },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const note = ref<Note | null>(null);
    const editing = ref(false);

    const noteId = Number(route.params.id);

    onMounted(async () => {
      const { data } = await NotesApi.getAll();
      note.value = data.find((n) => n.id === noteId) || null;
    });

    const save = async () => {
      if (!note.value) return;
      await NotesApi.update(note.value);
      editing.value = false;
    };

    const remove = async () => {
      await NotesApi.remove(noteId);
      await router.push('/');
    };

    return { note, editing, save, remove };
  },
};
</script>

<template>
  <q-page padding>
    <Container>
      <div v-if="note">
        <div v-if="editing">
          <form @submit.prevent="save">
            <q-input v-model="note.title" label="Title" filled />
            <q-input v-model="note.description" label="Description" filled class="q-mt-sm" dense />

            <q-card flat bordered class="q-mt-sm">
              <q-editor v-model="note.content" min-height="5rem" />
            </q-card>

            <div class="q-mt-md">
              <q-btn color="positive" type="submit">Done</q-btn>
            </div>
          </form>
        </div>

        <div v-else>
          <div class="row items-center justify-between">
            <h3>{{ note.title }}</h3>
            <div>
              <q-btn round color="secondary" icon="edit" @click="editing = true" />
              <q-btn round color="red" icon="delete" @click="remove" />
            </div>
          </div>

          <div>{{ note.description }}</div>
          <div class="q-mt-md" v-html="note.content" />
        </div>
      </div>

      <div v-else>Загрузка...</div>
    </Container>
  </q-page>
</template>
