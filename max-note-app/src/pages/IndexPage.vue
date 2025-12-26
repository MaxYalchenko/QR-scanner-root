<script lang="ts">
import Container from 'src/components/ContainerComponents.vue';
import NoteCard from 'src/components/NoteCard.vue';
//import { useLocalNotes } from 'src/helper';
import { onMounted, ref } from 'vue';
import { NotesApi, type Note } from 'src/api/notes';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: { NoteCard, Container },
  name: 'PageIndex',
  setup() {
    const notes = ref<Note[]>([]);
    const router = useRouter();

    onMounted(async () => {
      const { data } = await NotesApi.getAll();
      notes.value = data;
    });

    return { notes, router };
  },
});
</script>

<template>
  <q-page padding>
    <Container>
      <div class="row items-center justify-between">
        <h3>Мои заметки</h3>
        <div>
          <q-btn round color="positive" icon="add" to="/new"></q-btn>
        </div>
      </div>

      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :title="note.title"
        :description="note.description"
        @click="router.push(`/note/${note.id}`)"
      />
      <div v-if="notes.length === 0">Вы не создавали никаких заметок</div>
    </Container>
  </q-page>
</template>
