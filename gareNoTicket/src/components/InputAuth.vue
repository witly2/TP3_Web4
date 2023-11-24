<template >
        <div class="form-group mb-3">
            <label class="form-label text-secondary" :for=" name"> {{label}}</label>
            <input
               
                :type="type"
                class="form-control"
                @input="handleInput"
                :value="modelValue"
                :name="name"
                :id="name"
            />
     
        </div>
</template>

  
<script>
  export default {
    props: {
      type: {
        type: String,
        required: true,
      },
      name:{
        type:String,
        required:true
      },
      
      label: {
        type: String,
        required: true,
      },
     
      modelValue:String
    },
    methods: {
        handleInput(event){
            this.$emit("update:modelValue",event.target.value)
            //console.log("event "+ event.target.value)
        }
    },
  };

 
</script>
