import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Medium from '@/components/Medium';
import Navigation from '@/components/Navigation';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Navigation',
      component: Navigation,
    },
    {
      path: '/hackernews',
      name: 'hackernews',
      component: Hello,
    },
    {
      path: '/medium',
      name: 'medium',
      component: Medium,
    },
  ],
});
