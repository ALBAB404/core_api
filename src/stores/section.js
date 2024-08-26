import { defineStore } from "pinia";
import axiosInstance from "@/services/axiosService.js";

export const useSection = defineStore("section", {
    state: () =>({
        sections : {},
        loading : false,
        isActive : false,
    }),

        actions: {
            async getData(){
                try {
                    const res = await axiosInstance.get('/sections');
                    if(res.data.success){
                        this.sections = res.data?.result              
                        return res.data?.result
                    }
                } catch (error) {
                    console.log(error);
                }finally{
                    this.loading = false;
                }
            }
        }
})