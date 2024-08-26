// All Import File  Code Is Here......................................................................................................
import { defineStore } from 'pinia'
import axiosInstance from "@/services/axiosService.js";




export const useBanner = defineStore('banner', {
  // All Variable  Code Is Here.....................................................................................................
  state: () => ({ 
    loading: false,
  }),
  
  actions: {
    // API Calling Code Is Here.....................................................................................................
    
    async getData(data = null) {
      try {
        const res = await axiosInstance.get("/banners", {params:{
          type:data,
        }});
        if (res.status === 200) {
           return res.data.result
        }
      } catch (error) {
        console.log(error);
      }
    },

  },
  })
  // All Function  Code Is Here.....................................................................................................