<template>
  <div id="planning">
    <header>
      <h1>Planning</h1>
      <p>{{ startDay.toDateString() }} — {{ endDay.toDateString() }}</p>
    </header>
    <main>
      <section
        v-for="story in stories"
        :key="story.id"
        class="story"
        :id="`story${story.id}`"
      >
        <h2>{{ story.title }} (#{{ story.id }}): {{ story.points }} points</h2>
        <div v-for="task in story.tasks" :key="task.id" class="task">
          <input
            type="checkbox"
            v-model="task.completed"
            :id="`task${task.id}`"
            :name="`task${task.id}`"
            @input="updateStory(story.id, task.id)"
          />
          <label for="task${task.id}">{{ task.title }}</label>
          <a href="#" class="remove" @click="removeTask(story.id, task.id)"
            >(×)</a
          >
        </div>
        <form
          v-if="addTask === story.id"
          @submit.prevent="addToStory(story.id)"
        >
          <input type="text" v-model="newTask" id="newTask" />
          <input type="submit" value="+" />
          <input type="button" value="×" @click="hideAdd" />
        </form>
        <a
          :href="`#story${story.id}`"
          class="addTask"
          @click="showAdd(story.id)"
          v-else
          >(+ add a task)</a
        >
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "PlanningView",
  data() {
    return {
      startDay: new Date(),
      endDay: new Date(),
      stories: [],
      addTask: null,
      newTask: "",
    };
  },
  created() {
    this.startDay = this.$root.$data.currWeek.startDay;
    this.endDay = this.$root.$data.currWeek.endDay;
    this.stories = this.$root.$data.stories.filter(
      (story) =>
        story.status === "In Progress" ||
        (story.status === "Completed" &&
          story.completionDate.getTime() > this.startDay.getTime() &&
          story.completionDate.getTime() <= this.endDay.getTime())
    );
  },
  methods: {
    showAdd(storyNumber) {
      this.newTask = "";
      this.addTask = storyNumber;
    },
    hideAdd() {
      this.addTask = null;
    },
    addToStory(storyNumber) {
      const story = this.stories.find((story) => story.id === storyNumber);
      const taskId = (story.tasks.at(-1)?.id || 0) + 1;
      if (this.newTask !== "")
        story.tasks.push({
          completed: false,
          id: taskId,
          title: this.newTask,
          completionDate: null,
        });

      this.newTask = "";
      document.getElementById("newTask").focus();
    },
    removeTask(storyId, taskId) {
      const story = this.stories.find((story) => story.id === storyId);
      const taskIndex = story.tasks.findIndex((task) => task.id === taskId);
      story.tasks.splice(taskIndex, 1);
    },
    updateStory(storyId, taskId) {
      const story = this.stories.find((story) => story.id === storyId);
      const task = story.tasks.find((task) => task.id === taskId);
      task.completed = !task.completed;

      if (task.completed && task.completionDate === null)
        task.completionDate = new Date();
      else if (!task.completed && task.completionDate !== null)
        task.completionDate = null;

      const allTasksComplete =
        story.tasks.length > 0 && story.tasks.every((task) => task.completed);
      if (allTasksComplete && story.status !== "Completed") {
        story.status = "Completed";
        story.completionDate = new Date();
      } else if (!allTasksComplete && story.status === "Completed") {
        story.status = "In Progress";
        story.completionDate = null;
      }
    },
  },
};
</script>

<style scoped>
#planning {
  margin: 0 5vw;
}

.story {
  display: flex;
  flex-direction: column;
}

.story > * {
  text-align: left;
  margin: 0.25rem 0;
  margin-left: 5vw;
}

.story h2 {
  margin: 1rem 0 0.5rem;
}

.story a {
  color: blue;
  text-decoration: none;
}

.story .task {
  display: flex;
  align-content: left;
  gap: 1.25vw;
}

.story form {
  display: flex;
  gap: 0.625rem;
}
</style>
