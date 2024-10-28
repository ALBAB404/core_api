<script setup>
import { ref,nextTick, computed, defineEmits  } from "vue";

const emit = defineEmits(['productVariationPrice']);
const selectedAttributes                      = ref({});
const isAttributeDisabledUnSelectInitialStage = ref(false);
const availableAttributes                     = ref({});
const attribute_id_1                          = ref(null);
const attribute_id_2                          = ref(null);
const attribute_id_3                          = ref(null);
const attribute_value_id_1                    = ref(null);
const attribute_value_id_2                    = ref(null);
const attribute_value_id_3                    = ref(null);
const productVariationData                    = ref("");
const productVariationPrice                   = ref("");

const sendVariationProductPrice = (data) => {
  emit('productVariationPrice', data);
};

// Check if an attribute value is selected start
const isSelected = (attributeKey, attributeValue) => {
  return selectedAttributes.value[attributeKey] == attributeValue;
};

// Check if an attribute value is selected end

// Reset function to clear selections start
const resetSelections = () => {
  selectedAttributes.value = {};
  availableAttributes.value = {};
  productVariationPrice.value = [];
  productVariationData.value = "";
  attribute_id_1.value = null;
  attribute_id_2.value = null;
  attribute_id_3.value = null;
  attribute_value_id_1.value = null;
  attribute_value_id_2.value = null;
  attribute_value_id_3.value = null;
  sendVariationProductPrice(productVariationPrice.value);
  isAttributeDisabledUnSelectInitialStage.value = false;
};

// Reset function to clear selections end

// Computed property to check if any attribute is selected start
const isAnyAttributeSelected = computed(() => {
  return Object.keys(selectedAttributes.value).length > 0;
});
// Computed property to check if any attribute is selected end


// Function to check if an attribute value should be disabled
const isAttributeDisabled = (attributeKey, attributeValue) => {
  // Check if the attribute key exists in availableAttributes
  if (availableAttributes.value[attributeKey]) {
    // If the attribute key exists, check if the value is present in availableAttributes
    return !availableAttributes.value[attributeKey].some(
      (attr) => attr?.value == attributeValue
    );
  }
  // If the attribute key doesn't exist in availableAttributes, return false (not disabled)
  return false;
};


// Function to filter variations by a specific size
function getVariationsByattribute1(data, sizeValue) {  
  // Step 1: Filter data based on attribute_value_1 (Size)
  const filteredBySize = data.filter((item) => item.attribute_value_1?.value == sizeValue.attribute_value);
  console.log(filteredBySize)
  // Step 2: Extract matching colors and weights, including their IDs
  
  const variations = filteredBySize.map((item) => ({
    [item.attribute_value_2?.attribute?.name || '']: {
      value: item.attribute_value_2?.value || null,
      id: item.attribute_value_2?.attribute?.id || null, // Handle ID as optional
    },
    [item.attribute_value_3?.attribute?.name || '']: {
      value: item.attribute_value_3?.value || null,
      id: item.attribute_value_3?.attribute?.id || null,
    },
  }));

  // Step 3: Remove duplicates based on value and ID
  const uniqueVariations = variations.filter((v, index, self) => 
    index == self.findIndex((t) => {
      const keys = Object.keys(v);  // Get the keys dynamically
      return (
        (t[keys[0]]?.value == v[keys[0]]?.value) && 
        (t[keys[0]]?.id == v[keys[0]]?.id) &&
        (t[keys[1]]?.value == v[keys[1]]?.value) && 
        (t[keys[1]]?.id == v[keys[1]]?.id)
      );
    })
  );

  return uniqueVariations;

}

// Function to filter variations by a specific color
function getVariationsByattribute2(data, attributeValue) {

  // Step 1: Filter data based on attribute_value_1 (Size)
  const filteredBySize = data.filter(
    (item) => item.attribute_value_2?.value == attributeValue.attribute_value
  );

  // Step 2: Extract matching colors and weights, including their IDs
  const variations = filteredBySize.map((item) => ({
    [item.attribute_value_1?.attribute?.name || '']: {
      value: item.attribute_value_1?.value || null,
      id: item.attribute_value_1?.attribute?.id || null,
    },
    [item.attribute_value_3?.attribute?.name || '']: {
      value: item.attribute_value_3?.value || null,
      id: item.attribute_value_3?.attribute?.id || null,
    },
  }))

  // Step 3: Remove duplicates based on value and ID
  const uniqueVariations = variations.filter((v, index, self) => 
    index == self.findIndex((t) => {
      const keys = Object.keys(v);  // Get the keys dynamically
      return (
        (t[keys[0]]?.value == v[keys[0]]?.value) && 
        (t[keys[0]]?.id == v[keys[0]]?.id) &&
        (t[keys[1]]?.value == v[keys[1]]?.value) && 
        (t[keys[1]]?.id == v[keys[1]]?.id)
      );
    })
  );

  return uniqueVariations;

}

// Function to filter variations by a specific weight
function getVariationsByattribute3(data, attributeValue) {

  // Step 1: Filter data based on attribute_value_1 (Size)
  const filteredBySize = data.filter(
    (item) => item.attribute_value_3?.value == attributeValue.attribute_value
  );

  // Step 2: Extract matching colors and weights, including their IDs
  const variations = filteredBySize.map((item) => ({
    [item.attribute_value_1?.attribute?.name || '']: {
      value: item.attribute_value_1?.value || null,
      id: item.attribute_value_1?.attribute?.id || null,
    },
    [item.attribute_value_2?.attribute?.name || '']: {
      value: item.attribute_value_2?.value || null,
      id: item.attribute_value_2?.attribute?.id || null,
    },
  }));

  // Step 3: Remove duplicates based on value and ID
  const uniqueVariations = variations.filter((v, index, self) => 
    index == self.findIndex((t) => {
      const keys = Object.keys(v);  // Get the keys dynamically
      return (
        (t[keys[0]]?.value == v[keys[0]]?.value) && 
        (t[keys[0]]?.id == v[keys[0]]?.id) &&
        (t[keys[1]]?.value == v[keys[1]]?.value) && 
        (t[keys[1]]?.id == v[keys[1]]?.id)
      );
    })
  );

  return uniqueVariations;

}

const getVariations = (attributeKey, attributeValue, allVariations, index) => {
  // console.log(attributeKey);
  // console.log(attributeValue);

  // get prices filtering start
  if (index == 0) {
    attribute_id_1.value = attributeValue.attribute_id;
    attribute_value_id_1.value = attributeValue.attribute_value_id;
    productVariationData.value = {
      attribute_id_1: attribute_id_1.value || "",
      attribute_value_id_1: attribute_value_id_1.value || "",
      attribute_id_2: "",
      attribute_value_id_2: attribute_value_id_2.value || "",
      attribute_id_3: "",
      attribute_value_id_3: attribute_value_id_3.value || "",
    };
  }

  if (index == 1) {
    attribute_id_2.value = attributeValue.attribute_id;
    attribute_value_id_2.value = attributeValue.attribute_value_id;
    productVariationData.value = {
      attribute_id_1: "",
      attribute_value_id_1: attribute_value_id_1.value || "",
      attribute_id_2: attribute_id_2.value || "",
      attribute_value_id_2: attribute_value_id_2.value || "",
      attribute_id_3: "",
      attribute_value_id_3: attribute_value_id_3.value || "",
    };
  }
  if (index == 2) {
    attribute_id_3.value = attributeValue.attribute_id;
    attribute_value_id_3.value = attributeValue.attribute_value_id;
    productVariationData.value = {
      attribute_id_1: "",
      attribute_value_id_1: attribute_value_id_1.value || "",
      attribute_id_2: "",
      attribute_value_id_2: attribute_value_id_2.value || "",
      attribute_id_3: attribute_id_3.value || "",
      attribute_value_id_3: attribute_value_id_3.value || "",
    };
  }


  productVariationPrice.value = allVariations.filter((e) => {
    let isMatch = true;

    if (productVariationData.value.attribute_value_id_1 && e.attribute_value_1) {
      isMatch = isMatch && (e.attribute_value_1.id == productVariationData.value.attribute_value_id_1);
    }
    
    if (productVariationData.value.attribute_value_id_2 && e.attribute_value_2) {
      isMatch = isMatch && (e.attribute_value_2.id == productVariationData.value.attribute_value_id_2);
    }
    
    if (productVariationData.value.attribute_value_id_3 && e.attribute_value_3) {
      isMatch = isMatch && (e.attribute_value_3.id == productVariationData.value.attribute_value_id_3);
    }

    return isMatch;
  });

  sendVariationProductPrice(productVariationPrice.value);

// get prices filtering end


  


  isAttributeDisabledUnSelectInitialStage.value = true;
  const uniqueVariations = getVariationsByattribute1(allVariations, attributeValue);
  const uniqueVariationsAttribute2 = getVariationsByattribute2(allVariations, attributeValue);
  const uniqueVariationsAttribute3 = getVariationsByattribute3(allVariations, attributeValue);
  console.log(uniqueVariations);
  console.log(uniqueVariationsAttribute2);
  console.log(uniqueVariationsAttribute3);
   allVariations.filter(e => {
    console.log(e);
    
    // Update available attributes if the size is selected
    if (e.attribute_value_1 != null && attributeKey == e.attribute_value_1.attribute.name) {
      console.log('aaa');
      // Store available colors and weights
      availableAttributes.value[e.attribute_value_2?.attribute?.name] = uniqueVariations.map((v) => v[e.attribute_value_2?.attribute.name]);
      availableAttributes.value[e.attribute_value_3?.attribute?.name] = uniqueVariations.map((v) => v[e.attribute_value_3?.attribute.name]);
    }else if(e.attribute_value_2 != null && attributeKey == e.attribute_value_2.attribute.name){
      console.log('b');
      availableAttributes.value[e.attribute_value_1?.attribute.name] = uniqueVariationsAttribute2.map((v) => v[e.attribute_value_1?.attribute.name]);
      availableAttributes.value[e.attribute_value_3?.attribute.name] = uniqueVariationsAttribute2.map((v) => v[e.attribute_value_3?.attribute.name]);
    }else if(e.attribute_value_3 != null && attributeKey == e.attribute_value_3.attribute.name){
      console.log('c');
      availableAttributes.value[e.attribute_value_1?.attribute.name] = uniqueVariationsAttribute3.map((v) => v[e.attribute_value_1?.attribute.name]);
      availableAttributes.value[e.attribute_value_2?.attribute.name] = uniqueVariationsAttribute3.map((v) => v[e.attribute_value_2?.attribute.name]);
    }
  })
  

  // select and unselect attributes start
  if (selectedAttributes.value[attributeKey] == attributeValue.attribute_value) {
    // Unselect if already selected
    resetSelections();
    delete selectedAttributes.value[attributeKey];
  } else {
    // Select the attribute value
    selectedAttributes.value[attributeKey] = attributeValue.attribute_value;
  }
  // select and unselect attributes end
};

// get Is Default Attribute start
const getIsDefaultAttribute = (allVariations) => {
  // Find attributes where is_default is true
  const defaultAttributes = allVariations.filter(e => e.is_default);

  // get price start
    productVariationPrice.value = defaultAttributes
    sendVariationProductPrice(productVariationPrice.value);
  // get price end
    
  // Set selected attributes based on the default values
  defaultAttributes.forEach(attribute => {
    selectedAttributes.value[attribute.attribute_value_1.attribute.name] = attribute.attribute_value_1.value;
    selectedAttributes.value[attribute.attribute_value_2.attribute.name] = attribute.attribute_value_2.value;
    selectedAttributes.value[attribute.attribute_value_3.attribute.name] = attribute.attribute_value_3.value;
  });
};
// get Is Default Attribute end

const props = defineProps({
  productVariations: Object,
  allVariations: Array,
  required: true,
});


nextTick(() => {
  getIsDefaultAttribute(props.allVariations);
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
              'is-active': !isAttributeDisabled(key, attributeValue.attribute_value) && isSelected(key, attributeValue.attribute_value),
              'is-disabled': isAttributeDisabled(key, attributeValue.attribute_value) && isAttributeDisabledUnSelectInitialStage,
            }"
            @click.prevent="!isAttributeDisabled(key, attributeValue.attribute_value) && getVariations(key, attributeValue, allVariations, index)"
          >
            {{ attributeValue.attribute_value }}
          </a>
        </li>
      </ul>
    </div>
    <!-- Reset button -->
    <button v-if="isAnyAttributeSelected" @click="resetSelections" class="reset-btn">
      Reset
    </button>
    <h1>{{ productVariationPrice[0]?.sell_price }}</h1>
  </span>
</template>

<style scoped>
@import "@/assets/css/product-details.css";

.reset-btn{
  cursor: pointer;
  border: 1px solid red;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: red;
  color: white;
}

.is-active {
  color: var(--white) !important;
  background-color: var(--secondary-color) !important;
}

.is-disabled {
  background: rgb(199, 40, 40);
  color: white;
  border: 0;
  cursor: pointer;
  padding: 1em;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
