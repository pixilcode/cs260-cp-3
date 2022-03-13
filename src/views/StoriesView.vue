<template>
  <div id="stories">
    <header>
      <h1>Stories</h1>
    </header>
    <main>
      <header>
        <h2>Story #</h2>
        <h2>Title</h2>
        <h2>Description</h2>
        <h2>Points</h2>
        <h2>Status</h2>
      </header>
      <section class="story" v-for="story in stories" :key="story.id">
        <p class="storyNum">{{ story.id }}</p>
        <p class="storyTitle" v-if="editStory === story.id">
          <input type="text" v-model="story.title" />
        </p>
        <p class="storyTitle" v-else>
          {{ story.title }}
        </p>
        <p class="storyDescription" v-if="editStory === story.id">
          As <input type="text" v-model="story.description.role" /> , I want
          <input type="text" v-model="story.description.goal" />
          so that <input type="text" v-model="story.description.purpose" />.
        </p>
        <p class="storyDescription" v-else>
          As {{ story.description.role }}, I want
          {{ story.description.goal }} so that {{ story.description.purpose }}.
        </p>
        <p class="points" v-if="editStory === story.id">
          <input type="number" v-model="story.points" min="1" />
        </p>
        <p class="points" v-else>{{ story.points }}</p>
        <p class="storyStatus">{{ story.status }}</p>
        <div class="controls">
          <input
            type="button"
            value="Done"
            v-if="editStory === story.id"
            @click="doneEditing(story.id)"
          />
          <input type="button" value="Edit" v-else @click="edit(story.id)" />
          <input type="button" value="Delete" @click="remove(story.id)" />
          <input
            type="button"
            value="Plan"
            v-show="story.status === 'Ready'"
            @click="plan(story.id)"
          />
          <input
            type="button"
            value="Remove from Plan"
            v-show="story.status === 'In Progress'"
            @click="removePlan(story.id)"
          />
        </div>
      </section>
      <p id="addStory" @click="newStory">(+ add a story)</p>
    </main>
  </div>
</template>

<script>
export default {
  name: "StoriesView",
  data() {
    return {
      stories: [],
      editStory: null,
    };
  },
  created() {
    this.stories = this.$root.$data.stories;
  },
  methods: {
    edit(storyId) {
      this.editStory = storyId;
    },
    doneEditing(storyId) {
      this.editStory = null;
      const currStory = this.stories.find((story) => story.id === storyId);
      if (!/\d+/.test(currStory.points) || parseInt(currStory.points) < 1)
        currStory.points = 1;
      else currStory.points = parseInt(currStory.points);
    },
    newStory() {
      const storyId = (this.stories.at(-1)?.id || 0) + 1;
      this.stories.push({
        id: storyId,
        title: "",
        description: {
          role: "",
          goal: "",
          purpose: "",
        },
        status: "Ready",
        completionDate: null,
        points: 1,
        tasks: [],
      });
      this.editStory = storyId;
    },
    plan(storyId) {
      this.stories.find((story) => story.id === storyId).status = "In Progress";
    },
    removePlan(storyId) {
      this.stories.find((story) => story.id === storyId).status = "Ready";
    },
    remove(storyId) {
      const storyIndex = this.stories.findIndex(
        (story) => story.id === storyId
      );
      this.stories.splice(storyIndex, 1);
    },
  },
};
</script>

<style scoped>
#stories {
  margin: 0 5vw;
}

main {
  display: grid;
  grid-template-columns: auto auto 1fr auto auto auto;
  gap: 2.5vw;
  align-items: center;
}

main header,
.story {
  grid-column: span 6;
  display: grid;
  grid-template-columns: subgrid;

  margin: 1rem 0.625vw;
  align-items: center;
}

.story * {
  text-align: left;
}

#addStory {
  color: blue;
}

#addStory:hover {
  cursor: pointer;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.controls input[type="button"] {
  text-align: center;
}
</style>
