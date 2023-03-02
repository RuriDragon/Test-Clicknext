<script setup>
    import { useDisplay } from 'vuetify'
    import { storeToRefs } from 'pinia'
    import { useAlertStore } from '~/store/alert'
    import { useLoginStore } from '~/store/login'

    const loginStore = useLoginStore()
    const isLogin = loginStore.getStatus

    const alertStore = useAlertStore()
    const { isAlert , message , error } = storeToRefs(alertStore)

    const menus = [
        {name:'Deposit / Withdraw',link:'home',value:'home'},
        {name:'Transaction',link:'transaction',value:'transaction'},
    ];

    // const selectMenu = ref(0)  // 0 = set default is link home
    const drawer = ref(true)

    const { mobile } = useDisplay()

    function scrollToTop() {
        window.scrollTo(0,0);
    }

    onMounted(() => {
        scrollToTop()
        if(mobile.value){
            drawer.value = false
        }
    })

</script>
<template>
    <div>
        <v-app-bar flat border>

            <template v-slot:prepend>
            <v-app-bar-nav-icon v-if="mobile" @click="drawer = !drawer"></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title>ClickNext</v-app-bar-title>

            <template v-slot:append>
                <v-btn v-if="isLogin" @click="loginStore.logout" icon="mdi-logout"></v-btn>
            </template>

        </v-app-bar>
  
        <v-navigation-drawer v-model="drawer" touchless>

            <!-- <v-item-group v-model="selectMenu" selected-class="bg-primary"> -->

                    <v-list v-for="(menu,index) in menus" variant="flat" nav>
                        <!-- <v-item v-slot="{ isSelected, toggle }"> -->
                            <v-list-item :to="menu.link" :title="menu.name"></v-list-item>
                        <!-- </v-item> -->
                    </v-list>
                
            <!-- </v-item-group> -->
        </v-navigation-drawer>
  
        <v-main style="min-height: 100vh;">
            <v-container class="bg-grey-lighten-4" fluid>
                <v-card class="main-container pa-4">
                    <slot />
                </v-card>
            </v-container>
        </v-main>

        <v-snackbar v-model="isAlert" :color="error ? 'red':'green'" location="top">
            {{message}}
        <template v-slot:actions>
            <v-btn
            @click="alertStore.closeAlert"
            color="white"
            variant="text"
            >
            Close
            </v-btn>
        </template>
        </v-snackbar>

    </div>
</template>

<style>
    .main-container {
        /* ... - toolbar - padding top&bottom  */
        height: calc(100vh - 64px - 16px - 16px);
    }
</style>