<script setup>
import { ref } from "vue";
// Track selected attributes
const selectedAttributes = ref({});

// Check if an attribute value is selected
const isSelected = (attributeKey, attributeValue) => {
  return selectedAttributes.value[attributeKey] === attributeValue;
};

// Function to filter variations by a specific size
function getVariationsBySize(data, sizeValue) {
  // Step 1: Filter data based on attribute_value_1 (Size)
  const filteredBySize = data.filter(
    (item) => item.attribute_value_1.value === sizeValue.attribute_value
  );

  // Step 2: Extract matching colors and weights, including their IDs
  const variations = filteredBySize.map((item) => ({
    [item.attribute_value_2.attribute.name]: {
      value: item.attribute_value_2.value,
      id: item.attribute_value_2.attribute.id, // Add ID here
    },
    [item.attribute_value_3.attribute.name]: {
      value: item.attribute_value_3.value,
      id: item.attribute_value_3.attribute.id, // Add ID here
    },
  }));

  // Step 3: Remove duplicates based on value and ID
  const uniqueVariations = variations.filter((v, index, self) => 
    index === self.findIndex((t) => {
      const keys = Object.keys(v);  // Get the keys dynamically
      return t[keys[0]].value === v[keys[0]].value && 
             t[keys[0]].id === v[keys[0]].id &&
             t[keys[1]].value === v[keys[1]].value && 
             t[keys[1]].id === v[keys[1]].id;
    })
  );

  // console.log(uniqueVariations);

  return uniqueVariations;
}

const getVariations = (attributeKey, attributeValue, allVariations) => {
  const uniqueVariations =  getVariationsBySize(allVariations, attributeValue);
  console.log(uniqueVariations);
  console.log(attributeValue);
  
  // select and unselect attributes start
  if (
    selectedAttributes.value[attributeKey] === attributeValue.attribute_value
  ) {
    // Unselect if already selected
    delete selectedAttributes.value[attributeKey];
  } else {
    // Select the attribute value
    selectedAttributes.value[attributeKey] = attributeValue.attribute_value;
  }
  // select and unselect attributes end
};

const props = defineProps({
  productVariations: Object,
  allVariations: Object,
  required: true,
});
</script>

<template>
  <span v-if="productVariations" class="mb-5">
    <div
      class="details-list-group"
      v-for="(attribute, key, index) in productVariations"
      :key="index"
    >
      <label class="details-list-title">{{ key }}</label>
      <ul class="details-tag-list">
        <li
          v-for="(attributeValue, indexAttributeValue) in attribute"
          :key="indexAttributeValue"
        >
          <a
            href="#"
            :class="{
              'is-active': isSelected(key, attributeValue.attribute_value),
            }"
            @click.prevent="getVariations(key, attributeValue, allVariations)"
          >
            {{ attributeValue }}
          </a>
        </li>
      </ul>
    </div>
  </span>
</template>

<style scoped>
@import "@/assets/css/product-details.css";
.is-active {
  color: var(--white) !important;
  background-color: var(--secondary-color) !important;
}
</style>
