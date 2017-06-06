<template>
  <div class="hello">
    <ul>
      <li v-for="(story,index) in stories" >{{ index + 1 }}：<a v-bind:href="story.url">{{ story.title }}</a></li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'hello',
  data() {
    return {
      stories: [],
    };
  },

  mounted() {
    axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(response => response.data)
    .then((topstories) => {
      const requests = [];
      for (let i = 0; i < 10; i += 1) {
        requests.push(this.getStory(topstories[i]));
      }
      axios.all(requests)
      .then(result => result.map((story) => {
        const data = story.data;
        if (data.url === undefined) {
          data.url = `https://news.ycombinator.com/item?id=${data.id}`;
        }
        return data;
      })
      .forEach(data => this.stories.push(data)),
     );
    });
  },

  methods: {
    getStory(id) {
      const url = this.buildUrl(id);
      return axios.get(url);
    },
    buildUrl(id) {
      return `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 5px;
}

a {
  color: #42b983;
}
</style>
