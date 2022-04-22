const app = Vue.createApp({ 
    data(){
        return {  
            phoneNumber: null,
            enteredMessage: null,
            timeScheduled: null,  
            notice: null, 
            
            /** array: search results (crops) */
    /** string: for any warnings/errors */

        }
    },
    methods:{     
        createMessage(){ 
            this.notice = null; // reset notices/messages 
            axios.get('/createMessage', {params: {
                phoneNumber: this.phoneNumber,
                enteredMessage: this.enteredMessage,
                timeScheduled: this.timeScheduled,
               

            }} )
                .then(response => {
                    if (Array.isArray(response.data)) return this.results = response.data
                    this.showNotice(response.data)
                 })
                .catch(error =>  this.showNotice("No Results.") );
        },
        showNotice(text){
            this.notice = text;
            setTimeout(() => this.notice = false, 10000);
        },  
    }
}).mount('#app')