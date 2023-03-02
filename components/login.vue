<script setup>
    import { useLoginStore } from '~/store/login'
    const loginStore = useLoginStore();

    const setCookieLogin = useCookie('isLogin');

    const username = ref('');
    const password = ref('');
    const showPass = ref(false);
    const form = ref(false);
    const loading = ref(false);

    
    // const username = useState('username', () => '')
    // const password = useState('password', () => '')
    // const showPass = useState('showPass', () => false)
    // const form = useState('form', () => false)
    // const loading = useState('loading', () => false)

    // onMounted(() => {
    // })


    function onSubmit(){

        if (!form.value) return

        loading.value = true;

        setTimeout(()=> {
            setCookieLogin.value = true;
            loading.value = false;
            loginStore.login();
        },1000)
    };

    function required (v) {
        return !!v || 'Field is required'
    };

</script>
<template>
    <v-container fluid>
    <v-row style="height:100vh">
      <v-col align-self="center">
        <v-card class="mx-auto px-6 py-8" max-width="450" height="450">
            <div class="text-h4 mb-6">Login</div>

            <v-form
                v-model="form"
                @submit.prevent="onSubmit"
            >
            <v-text-field
                v-model="username"
                :readonly="loading"
                :rules="[required]"
                class="mb-2"
                clearable
                variant="outlined"
                label="Username"
            ></v-text-field>

            <v-text-field
                v-model="password"
                :readonly="loading"
                :rules="[required]"
                :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                @click:append="showPass = !showPass"
                clearable
                variant="outlined"
                label="Password"
                placeholder="Enter your password"
            ></v-text-field>

            <br>

            <v-btn
                :disabled="!form"
                :loading="loading"
                block
                color="green"
                size="large"
                type="submit"
                variant="elevated"
            >
                Sign In
            </v-btn>
            </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>