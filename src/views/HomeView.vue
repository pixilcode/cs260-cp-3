<template>
  <div class="home">
    <h1>Home</h1>
    <main>
      <section id="goals">
        <table>
          <thead>
            <tr>
              <th>Week</th>
              <th>Tasks</th>
              <th>Stories</th>
              <th>Total</th>
              <th>Goal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="week in weeks" :key="week.startDate.valueOf()">
              <td>
                {{ week.startDate.toDateString() }}—{{
                  week.endDay.toDateString()
                }}
              </td>
              <td>{{ week.taskSum }}</td>
              <td>{{ week.storySum }}</td>
              <td>{{ week.totalSum }}</td>
              <td v-if="week.goal">{{ week.goal }}</td>
              <td v-else>Unset</td>
            </tr>
          </tbody>
        </table>
        <p id="currGoal">
          Current week goal:
          <input type="number" v-if="editGoal" v-model="setGoal" min="0" />
          <span v-else>{{ currGoal }}</span>
          <span v-if="editGoal" class="change" @click="toggleEdit">(Done)</span>
          <span v-else class="change" @click="toggleEdit">(Edit)</span>
        </p>
      </section>

      <section id="tasks">
        <h2>Tasks</h2>
        <section
          v-for="story in stories"
          :key="story.id"
          class="story"
          :id="`story${story.id}`"
        >
          <h3>
            {{ story.title }} (#{{ story.id }}): {{ story.points }} points
          </h3>
          <div v-for="task in story.tasks" :key="task.id" class="task">
            <input
              type="checkbox"
              v-model="task.completed"
              :id="`task${task.id}`"
              :name="`task${task.id}`"
              @input="updateStory(story.id, task.id)"
            />
            <label for="task${task.id}">{{ task.title }}</label>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script>
function getStartOfWeek(date) {
  const startOfWeek = new Date();
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

export default {
  name: "HomeView",
  data() {
    return {
      stories: [],
      currWeek: {
        startDay: new Date(),
        endDay: new Date(),
      },
      weekGoals: [],
      editGoal: false,
      setGoal: null,
    };
  },
  created() {
    this.stories = this.$root.$data.stories;
    this.currWeek = this.$root.$data.currWeek;
    this.weekGoals = this.$root.$data.weekGoals;
  },
  methods: {
    toggleEdit() {
      this.editGoal = !this.editGoal;
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
  watch: {
    setGoal(goal) {
      const currGoal = this.weekGoals.find(
        (weekGoal) =>
          weekGoal.weekStart.getTime() === this.currWeek.startDay.getTime()
      );

      if (currGoal) currGoal.goal = goal;
      else
        this.weekGoals.push({
          weekStart: this.currWeek.startDay,
          goal,
        });
    },
  },
  computed: {
    currGoal() {
      const currGoal = this.weekGoals.find(
        (weekGoal) =>
          weekGoal.weekStart.getTime() === this.currWeek.startDay.getTime()
      );
      return currGoal?.goal || "Unset";
    },
    weeks() {
      const weeks = [];
      for (let story of this.stories) {
        for (let task of story.tasks) {
          if (task.completionDate === null) continue;
          const index = weeks.findIndex(
            (week) =>
              week.startDate.getTime() ===
              getStartOfWeek(task.completionDate).getTime()
          );
          if (index === -1) {
            const startDate = getStartOfWeek(task.completionDate);
            const endDay = getStartOfWeek(task.completionDate);
            endDay.setDate(startDate.getDate() + 6);
            weeks.push({
              startDate,
              endDay,
              taskSum: 1,
              storySum: 0,
              totalSum: 1,
            });
          } else {
            weeks[index].taskSum++;
            weeks[index].totalSum++;
          }
        }

        if (story.completionDate === null) continue;
        const index = weeks.findIndex(
          (week) =>
            week.startDate.getTime() ===
            getStartOfWeek(story.completionDate).getTime()
        );
        if (index === -1) {
          const startDate = getStartOfWeek(story.completionDate);
          const endDay = getStartOfWeek(story.completionDate);
          endDay.setDate(startDate.getDate() + 6);
          weeks.push({
            startDate,
            endDay,
            taskSum: 0,
            storySum: story.points,
            totalSum: story.points,
          });
        } else {
          weeks[index].storySum += story.points;
          weeks[index].totalSum += story.points;
        }
      }

      const index = weeks.findIndex(
        (week) =>
          week.startDate.getTime() ===
          getStartOfWeek(this.currWeek.startDay).getTime()
      );
      if (index === -1) {
        weeks.push({
          startDate: this.currWeek.startDay,
          endDay: this.currWeek.endDay,
          taskSum: 0,
          storySum: 0,
          totalSum: 0,
        });
      }

      const weeksWithGoals = weeks.map((week) => {
        const weekGoal = this.weekGoals.find(
          (goal) => goal.weekStart.getTime() === week.startDate.getTime()
        );
        if (weekGoal !== undefined) return { ...week, goal: weekGoal.goal };
        else return week;
      });

      return weeksWithGoals;
    },
  },
};
</script>

<style scoped>
main {
  display: grid;
  grid-template-columns: 9fr 6fr;
  margin: 0 5vw;
}

#tasks,
#goals {
  margin: 0 1.25vw;
  border: 0.25rem solid;
  padding: 0.5rem 1.25vw;
}

#goals {
  padding: 2rem 5vw;
}

#goals table {
  width: 100%;
}

#currGoal {
  text-align: left;
}

.change {
  color: blue;
  margin-left: 0.5rem;
}

.change:hover {
  cursor: pointer;
}

.story {
  display: flex;
  flex-direction: column;
}

.story > * {
  text-align: left;
  margin: 0.25rem 0;
  margin-left: 2.5vw;
}

.story h3 {
  margin: 1rem 0 0.5rem;
}

.story .task {
  display: flex;
  align-content: left;
  gap: 1.25vw;
}
</style>
