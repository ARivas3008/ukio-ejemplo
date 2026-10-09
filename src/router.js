import { createRouter, createWebHistory } from 'vue-router';
export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: () => import('./public/pages/home.component.vue') },
        {
            path: '/properties',
            children: [
                {
                    path: 'renting/new',
                    component: () => import('./properties/pages/feature.component.vue'),
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            component: () => import('./public/pages/page-not-found.component.vue'),
        },
    ],
});
