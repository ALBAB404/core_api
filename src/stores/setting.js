import { defineStore } from "pinia";
import axiosInstance from "@/services/axiosService.js";

export const useSetting = defineStore("setting", {
    state: () =>({
        settings : {},
        loading : false,
        isActive : false,
    }),

        actions: {
            async getData(data = null){
                try {
                    const response = await axiosInstance.get('/settings', {
                      params: {
                        key:data,
                        is_paginate: 0
                      }
                    });
                    this.settings = response.data.result
                    return response.data.result;
                  } catch (error) {
                    console.log(error);
                  }
            }
        }
})