<template>
  <div class="hello">
    <ul>
      <li v-for="(story,index) in stories" >
        {{ index + 1 }}：<a v-bind:href="story.url" target="_blank">{{ story.title }}</a>
        <br/>
        <span><timeago :since="story.time*1000" :auto-update="60"></timeago>  | <a v-bind:href="story.commentsUrl" target="_blank">{{ story.descendants }} comments</a></span>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import localForage from 'localforage';

export default {
  name: 'hello',
  data() {
    return {
      stories: [],
      updateTime: null,
    };
  },

  mounted() {
    if (this.stories.length > 0) {
      return;
    }
    localForage.getItem('last').then((value) => {
      // console.log(value);
      // 10分钟
      if (!value || value.timestamp + 600000 <= new Date().getTime()) {
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
            data.commentsUrl = `https://news.ycombinator.com/item?id=${data.id}`;
            if (data.url === undefined) {
              data.url = data.commentsUrl;
            }
            // console.log(data);
            return data;
          }).forEach((data) => {
            this.stories.push(data);
          }),
          ).then(() => {
            // 缓存这次请求的数据
            this.updateTime = new Date().getTime();
            const obj = { value: this.stories, timestamp: this.updateTime };
            localForage.setItem('last', obj);
            // .catch((err) => {
              // console.error(err);
            // });
          });
        });
      } else {
        value.value.forEach((data) => {
          this.stories.push(data);
        });
      }
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
  text-align: left;
  margin: 5px 5px;
}

span {
  margin: auto auto auto 25px;
}

a {
  text-decoration: none;
  color: #42b983;
}
a:visited {
  color: #828282;
}
</style>
